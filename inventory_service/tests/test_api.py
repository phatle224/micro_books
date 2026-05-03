import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi.testclient import TestClient

# Mock MongoDB before importing app to avoid connection errors in lifespan
with patch("motor.motor_asyncio.AsyncIOMotorClient") as mock_motor:
    mock_motor.return_value = MagicMock()
    from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_db():
    with patch("app.routes.get_db") as mock:
        db = AsyncMock()
        mock.return_value = db
        yield db

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "inventory-service"}

def test_validate_batch_success(mock_db):
    # Setup mock behavior for find_one
    def mock_find_one(query):
        book_id = query.get("_id")
        # In reality query is {"_id": ObjectId("...")}
        if "book1" in str(book_id):
            return {"_id": "book1", "title": "Book 1", "price": 10.0, "stock": 10}
        if "book2" in str(book_id):
            return {"_id": "book2", "title": "Book 2", "price": 20.0, "stock": 2}
        return None

    mock_db.books.find_one = AsyncMock(side_effect=mock_find_one)
    
    payload = {
        "items": [
            {"book_id": "507f1f77bcf86cd799439011", "quantity": 2}, # book1 equivalent
            {"book_id": "507f1f77bcf86cd799439012", "quantity": 1}  # book2 equivalent
        ]
    }
    
    # We need to mock ObjectId to avoid validation errors if we use dummy strings
    with patch("app.routes.ObjectId") as mock_oid:
        mock_oid.side_effect = lambda x: x # Just return the string for matching
        response = client.post("/api/books/validate-batch", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["available"] is True
    assert len(data["items"]) == 2

def test_validate_batch_insufficient_stock(mock_db):
    # Setup mock behavior for find_one
    mock_db.books.find_one = AsyncMock(return_value={"_id": "book1", "title": "Book 1", "price": 10.0, "stock": 1})
    
    payload = {
        "items": [
            {"book_id": "507f1f77bcf86cd799439011", "quantity": 5}
        ]
    }
    
    with patch("app.routes.ObjectId") as mock_oid:
        mock_oid.side_effect = lambda x: x
        response = client.post("/api/books/validate-batch", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["available"] is False
    assert data["items"][0]["available"] is False
    assert data["items"][0]["stock"] == 1
    assert data["items"][0]["requested"] == 5
