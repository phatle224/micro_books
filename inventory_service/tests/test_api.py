import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi.testclient import TestClient

# Giả lập MongoDB trước khi import ứng dụng để không gây lỗi kết nối
with patch("motor.motor_asyncio.AsyncIOMotorClient") as mock_motor:
    mock_motor.return_value = MagicMock()
    from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_db():
    """Tạo đối tượng Database giả lập cho các bài kiểm thử"""
    with patch("app.routes.get_db") as mock:
        db = AsyncMock()
        mock.return_value = db
        yield db

def test_health_check():
    """Kiểm tra trạng thái hoạt động của Inventory Service"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "inventory-service"}

def test_validate_batch_success(mock_db):
    """
    Kiểm tra chức năng xác thực tồn kho cho nhiều sản phẩm (thành công):
    Giả lập tìm thấy 2 cuốn sách trong kho với số lượng đủ đáp ứng.
    """
    # Cấu hình hành vi giả lập cho hàm tìm kiếm trong DB
    def mock_find_one(query):
        book_id = str(query.get("_id"))
        if "507f1f77bcf86cd799439011" in book_id:
            return {"_id": "507f1f77bcf86cd799439011", "title": "Book 1", "price": 10.0, "stock": 10}
        if "507f1f77bcf86cd799439012" in book_id:
            return {"_id": "507f1f77bcf86cd799439012", "title": "Book 2", "price": 20.0, "stock": 2}
        return None

    mock_db.books.find_one = AsyncMock(side_effect=mock_find_one)
    
    payload = {
        "items": [
            {"book_id": "507f1f77bcf86cd799439011", "quantity": 2}, 
            {"book_id": "507f1f77bcf86cd799439012", "quantity": 1} 
        ]
    }
    
    # Giả lập ObjectId của MongoDB để khớp với chuỗi ID truyền vào
    with patch("app.routes.ObjectId") as mock_oid:
        mock_oid.side_effect = lambda x: x 
        response = client.post("/api/books/validate-batch", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["available"] is True # Cả 2 cuốn sách đều phải còn hàng
    assert len(data["items"]) == 2

def test_validate_batch_insufficient_stock(mock_db):
    """
    Kiểm tra trường hợp xác thực thất bại do không đủ hàng trong kho.
    """
    # Giả lập sách chỉ còn 1 cuốn trong kho
    mock_db.books.find_one = AsyncMock(return_value={"_id": "507f1f77bcf86cd799439011", "title": "Book 1", "price": 10.0, "stock": 1})
    
    payload = {
        "items": [
            {"book_id": "507f1f77bcf86cd799439011", "quantity": 5} # Yêu cầu 5 cuốn nhưng chỉ còn 1
        ]
    }
    
    with patch("app.routes.ObjectId") as mock_oid:
        mock_oid.side_effect = lambda x: x
        response = client.post("/api/books/validate-batch", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["available"] is False # Kết quả phải là không đủ hàng
    assert data["items"][0]["available"] is False
    assert data["items"][0]["stock"] == 1
    assert data["items"][0]["requested"] == 5
