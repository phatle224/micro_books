import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi.testclient import TestClient
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
    # Mock DB find
    mock_cursor = MagicMock()
    mock_cursor.__aiter__.return_value = [
        {"_id": "book1", "title": "Book 1", "price": 10.0, "stock": 10},
        {"_id": "book2", "title": "Book 2", "price": 20.0, "stock": 2}
    ]
    mock_db.books.find.return_value = mock_cursor
    
    payload = {
        "items": [
            {"book_id": "book1", "quantity": 2},
            {"book_id": "book2", "quantity": 1}
        ]
    }
    
    response = client.post("/api/books/validate-batch", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["available"] is True
    assert len(data["items"]) == 2
    assert data["items"][0]["available"] is True
    assert data["items"][1]["available"] is True

def test_validate_batch_insufficient_stock(mock_db):
    # Mock DB find
    mock_cursor = MagicMock()
    mock_cursor.__aiter__.return_value = [
        {"_id": "book1", "title": "Book 1", "price": 10.0, "stock": 1}
    ]
    mock_db.books.find.return_value = mock_cursor
    
    payload = {
        "items": [
            {"book_id": "book1", "quantity": 5}
        ]
    }
    
    response = client.post("/api/books/validate-batch", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["available"] is False
    assert data["items"][0]["available"] is False
    assert data["items"][0]["stock"] == 1
    assert data["items"][0]["requested"] == 5
