import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi.testclient import TestClient
from app.models import OrderStatus

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

@pytest.fixture
def mock_user():
    return {
        "_id": "user123",
        "email": "test@example.com",
        "role": "user"
    }

@pytest.fixture
def mock_admin():
    return {
        "_id": "admin123",
        "email": "admin@example.com",
        "role": "admin"
    }

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "order-service"}

@patch("app.routes.get_current_user")
@patch("app.routes.httpx.AsyncClient.post")
@patch("app.routes.publish_order_created")
def test_create_order_success(mock_kafka, mock_httpx, mock_auth, mock_db, mock_user):
    # Setup mocks
    mock_auth.return_value = mock_user
    
    # Mock inventory validation response
    mock_httpx.return_value = MagicMock(
        status_code=200,
        json=lambda: {
            "available": True,
            "items": [
                {"book_id": "book1", "title": "Book 1", "price": 10.0, "requested": 2, "available": True}
            ]
        }
    )
    
    # Mock DB insert
    mock_db.orders.insert_one = AsyncMock(return_value=MagicMock(inserted_id="order123"))
    
    # Request payload
    payload = {
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "customer_address": "123 Street",
        "items": [
            {"book_id": "book1", "title": "Book 1", "price": 10.0, "quantity": 2}
        ]
    }
    
    response = client.post("/api/orders/", json=payload)
    
    assert response.status_code == 201
    assert response.json()["order_id"] == "order123"
    assert mock_db.orders.insert_one.called
    assert mock_kafka.called

@patch("app.routes.get_current_user")
def test_create_order_empty_items(mock_auth, mock_user):
    mock_auth.return_value = mock_user
    payload = {
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "customer_address": "123 Street",
        "items": []
    }
    response = client.post("/api/orders/", json=payload)
    assert response.status_code == 400
    assert "at least one item" in response.json()["detail"]
