import os

import httpx
from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime, timezone
from .models import OrderCreate, OrderUpdate, OrderStatus
from .auth import get_current_user, require_admin
from .kafka_producer import publish_order_created

router = APIRouter(prefix="/api/orders", tags=["Orders"])

INVENTORY_SERVICE_URL = os.getenv("INVENTORY_SERVICE_URL", "http://localhost:3002")


def get_db():
    from .main import db
    return db


@router.post("/", status_code=201)
async def create_order(order: OrderCreate, user: dict = Depends(get_current_user)):
    """Create a new order (Storefront). Publishes order_created event to Kafka."""
    if not order.items:
        raise HTTPException(status_code=400, detail="Order must include at least one item")

    validate_payload = {
        "items": [
            {"book_id": item.book_id, "quantity": item.quantity}
            for item in order.items
        ]
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                f"{INVENTORY_SERVICE_URL}/api/books/validate-batch",
                json=validate_payload,
            )
    except httpx.RequestError:
        raise HTTPException(status_code=502, detail="Inventory service unavailable")

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to validate inventory")

    validation = response.json()
    if not validation.get("available"):
        raise HTTPException(
            status_code=409,
            detail={"message": "Insufficient stock", "items": validation.get("items", [])},
        )

    validated_items = validation.get("items", [])
    validated_by_id = {item.get("book_id"): item for item in validated_items}
    order_items = []
    for item in order.items:
        info = validated_by_id.get(item.book_id)
        if not info or not info.get("available"):
            raise HTTPException(
                status_code=409,
                detail={"message": "Insufficient stock", "items": validated_items},
            )

        order_items.append({
            "book_id": item.book_id,
            "title": info.get("title", item.title),
            "price": info.get("price", item.price),
            "quantity": info.get("requested", item.quantity),
        })

    total_amount = sum(item["price"] * item["quantity"] for item in order_items)
    now = datetime.now(timezone.utc).isoformat()
    db = get_db()

    order_doc = {
        "customer_name": order.customer_name,
        "customer_email": user.get("email", order.customer_email),
        "customer_phone": order.customer_phone,
        "customer_address": order.customer_address,
        "user_id": user.get("_id"),
        "items": order_items,
        "total_amount": total_amount,
        "status": OrderStatus.PENDING,
        "created_at": now,
        "updated_at": now,
    }

    result = await db.orders.insert_one(order_doc)
    order_doc["_id"] = str(result.inserted_id)

    try:
        await publish_order_created(order_doc)
    except Exception as e:
        print(f"Warning: Failed to publish Kafka event: {e}")

    return {"message": "Order created successfully", "order_id": order_doc["_id"], "order": order_doc}


@router.get("/me")
async def list_my_orders(limit: int = 50, skip: int = 0, user: dict = Depends(get_current_user)):
    """List orders for the current user."""
    db = get_db()
    query = {"user_id": user.get("_id")}

    cursor = db.orders.find(query).sort("created_at", -1).skip(skip).limit(limit)
    orders = []
    async for order in cursor:
        order["_id"] = str(order["_id"])
        orders.append(order)

    total = await db.orders.count_documents(query)
    return {"orders": orders, "total": total, "limit": limit, "skip": skip}


@router.get("/")
async def list_orders(
    status: str = None,
    email: str = None,
    limit: int = 50,
    skip: int = 0,
    user: dict = Depends(require_admin),
):
    """List orders. Optionally filter by status or customer email."""
    db = get_db()
    query = {}
    if status:
        query["status"] = status
    if email:
        query["customer_email"] = email

    cursor = db.orders.find(query).sort("created_at", -1).skip(skip).limit(limit)
    orders = []
    async for order in cursor:
        order["_id"] = str(order["_id"])
        orders.append(order)

    total = await db.orders.count_documents(query)
    return {"orders": orders, "total": total, "limit": limit, "skip": skip}


@router.get("/{order_id}")
async def get_order(order_id: str, user: dict = Depends(get_current_user)):
    """Get a single order by ID."""
    db = get_db()
    try:
        order = await db.orders.find_one({"_id": ObjectId(order_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order["_id"] = str(order["_id"])
    if user.get("role") != "admin" and order.get("user_id") != user.get("_id"):
        raise HTTPException(status_code=403, detail="Not authorized to view this order")

    return order


@router.patch("/{order_id}")
async def update_order(order_id: str, update: OrderUpdate, user: dict = Depends(require_admin)):
    """Update order status (Admin)."""
    db = get_db()

    update_data = {}
    if update.status:
        update_data["status"] = update.status
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    try:
        result = await db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")

    order = await db.orders.find_one({"_id": ObjectId(order_id)})
    order["_id"] = str(order["_id"])
    return {"message": "Order updated", "order": order}


@router.get("/stats/summary")
async def get_order_stats(user: dict = Depends(require_admin)):
    """Get order statistics for Admin dashboard."""
    db = get_db()

    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "pending"})
    confirmed_orders = await db.orders.count_documents({"status": "confirmed"})
    shipped_orders = await db.orders.count_documents({"status": "shipped"})
    delivered_orders = await db.orders.count_documents({"status": "delivered"})

    # Calculate total revenue from confirmed + shipped + delivered orders
    pipeline = [
        {"$match": {"status": {"$in": ["confirmed", "shipped", "delivered"]}}},
        {"$group": {"_id": None, "total_revenue": {"$sum": "$total_amount"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total_revenue"] if revenue_result else 0

    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "confirmed_orders": confirmed_orders,
        "shipped_orders": shipped_orders,
        "delivered_orders": delivered_orders,
        "total_revenue": total_revenue,
    }
