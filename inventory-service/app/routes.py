from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime, timezone
from .models import BookCreate, BookUpdate, BookValidationRequest

router = APIRouter(prefix="/api/books", tags=["Books"])


def get_db():
    import app.main as main
    return main.db


@router.post("/", status_code=201)
async def create_book(book: BookCreate):
    """Create a new book (Admin)."""
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()

    book_doc = {
        **book.model_dump(),
        "created_at": now,
        "updated_at": now,
    }

    result = await db.books.insert_one(book_doc)
    book_doc["_id"] = str(result.inserted_id)
    return {"message": "Book created successfully", "book": book_doc}


@router.get("/")
async def list_books(category: str = None, search: str = None, limit: int = 50, skip: int = 0):
    """List all books. Optionally filter by category or search by title/author."""
    db = get_db()
    query = {}

    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"author": {"$regex": search, "$options": "i"}},
        ]

    cursor = db.books.find(query).sort("created_at", -1).skip(skip).limit(limit)
    books = []
    async for book in cursor:
        book["_id"] = str(book["_id"])
        books.append(book)

    total = await db.books.count_documents(query)
    return {"books": books, "total": total, "limit": limit, "skip": skip}


@router.get("/categories")
async def list_categories():
    """Get all distinct book categories."""
    db = get_db()
    categories = await db.books.distinct("category")
    return {"categories": [c for c in categories if c]}


@router.post("/validate-batch")
async def validate_batch(request: BookValidationRequest):
    """Validate stock availability and pricing for a batch of items."""
    db = get_db()
    results = []
    all_available = True

    for item in request.items:
        try:
            book = await db.books.find_one({"_id": ObjectId(item.book_id)})
        except Exception:
            book = None

        if not book:
            results.append({
                "book_id": item.book_id,
                "title": "",
                "price": 0,
                "stock": 0,
                "requested": item.quantity,
                "available": False,
            })
            all_available = False
            continue

        stock = book.get("stock", 0)
        available = item.quantity > 0 and stock >= item.quantity
        if not available:
            all_available = False

        results.append({
            "book_id": str(book.get("_id")),
            "title": book.get("title", ""),
            "price": book.get("price", 0),
            "stock": stock,
            "requested": item.quantity,
            "available": available,
        })

    return {"available": all_available, "items": results}


@router.get("/{book_id}")
async def get_book(book_id: str):
    """Get a single book by ID."""
    db = get_db()
    try:
        book = await db.books.find_one({"_id": ObjectId(book_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID")

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    book["_id"] = str(book["_id"])
    return book


@router.put("/{book_id}")
async def update_book(book_id: str, update: BookUpdate):
    """Update book details (Admin)."""
    db = get_db()

    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    try:
        result = await db.books.update_one(
            {"_id": ObjectId(book_id)},
            {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Book not found")

    book = await db.books.find_one({"_id": ObjectId(book_id)})
    book["_id"] = str(book["_id"])
    return {"message": "Book updated", "book": book}


@router.delete("/{book_id}")
async def delete_book(book_id: str):
    """Delete a book (Admin)."""
    db = get_db()
    try:
        result = await db.books.delete_one({"_id": ObjectId(book_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Book not found")

    return {"message": "Book deleted successfully"}


@router.get("/stats/summary")
async def get_inventory_stats():
    """Get inventory statistics for Admin dashboard."""
    db = get_db()

    total_books = await db.books.count_documents({})
    out_of_stock = await db.books.count_documents({"stock": 0})
    low_stock = await db.books.count_documents({"stock": {"$gt": 0, "$lte": 5}})

    pipeline = [
        {"$group": {"_id": None, "total_stock": {"$sum": "$stock"}, "total_value": {"$sum": {"$multiply": ["$price", "$stock"]}}}}
    ]
    stats_result = await db.books.aggregate(pipeline).to_list(1)
    total_stock = stats_result[0]["total_stock"] if stats_result else 0
    total_value = stats_result[0]["total_value"] if stats_result else 0

    return {
        "total_books": total_books,
        "total_stock": total_stock,
        "out_of_stock": out_of_stock,
        "low_stock": low_stock,
        "total_inventory_value": total_value,
    }
