from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime, timezone
from .models import OrderCreate, OrderUpdate, OrderStatus
from .kafka_producer import publish_order_created

router = APIRouter(prefix="/api/orders", tags=["Orders"])


def get_db():
    from .main import db
    return db


@router.post("/", status_code=201)
async def create_order(order: OrderCreate):
    """Create a new order (Storefront). Publishes order_created event to Kafka."""
    db = get_db()

    total_amount = sum(item.price * item.quantity for item in order.items)
    now = datetime.now(timezone.utc).isoformat()

    order_doc = {
        "customer_name": order.customer_name,
        "customer_email": order.customer_email,
        "customer_phone": order.customer_phone,
        "customer_address": order.customer_address,
        "items": [item.model_dump() for item in order.items],
        "total_amount": total_amount,
        "status": OrderStatus.PENDING,
        "created_at": now,
        "updated_at": now,
    }

    result = await db.orders.insert_one(order_doc)
    order_doc["_id"] = str(result.inserted_id)

    # Publish event to Kafka
    try:
        await publish_order_created(order_doc)
    except Exception as e:
        # Log but don't fail the order creation
        print(f"Warning: Failed to publish Kafka event: {e}")

    return {"message": "Order created successfully", "order_id": order_doc["_id"], "order": order_doc}


@router.get("/")
async def list_orders(status: str = None, email: str = None, limit: int = 50, skip: int = 0):
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
async def get_order(order_id: str):
    """Get a single order by ID."""
    db = get_db()
    try:
        order = await db.orders.find_one({"_id": ObjectId(order_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order["_id"] = str(order["_id"])
    return order


@router.patch("/{order_id}")
async def update_order(order_id: str, update: OrderUpdate):
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
async def get_order_stats():
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
