import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi.testclient import TestClient
from app.models import OrderStatus
from app.auth import get_current_user

# Mock MongoDB trước khi import app để tránh lỗi kết nối trong lifespan
# Bước này cực kỳ quan trọng khi chạy Unit Test trong CI mà không có DB thật
with patch("motor.motor_asyncio.AsyncIOMotorClient") as mock_motor:
    mock_motor.return_value = MagicMock()
    from app.main import app

# Khởi tạo client để giả lập các request HTTP tới app
client = TestClient(app)

@pytest.fixture
def mock_user():
    """Tạo thông tin người dùng giả để sử dụng trong các test cần xác thực"""
    return {
        "_id": "user123",
        "email": "test@example.com",
        "role": "user"
    }

@pytest.fixture
def mock_admin():
    """Tạo thông tin admin giả cho các test yêu cầu quyền quản trị"""
    return {
        "_id": "admin123",
        "email": "admin@example.com",
        "role": "admin"
    }

@pytest.fixture(autouse=True)
def override_auth(mock_user):
    """
    Tự động ghi đè cơ chế xác thực (Dependency Injection) của FastAPI.
    Luôn trả về mock_user để bỏ qua bước kiểm tra JWT thật.
    """
    app.dependency_overrides[get_current_user] = lambda: mock_user
    yield
    app.dependency_overrides = {}

@pytest.fixture
def mock_db():
    """Giả lập (Mock) kết nối Database để không thao tác trực tiếp với MongoDB"""
    with patch("app.routes.get_db") as mock:
        db = AsyncMock()
        mock.return_value = db
        yield db

def test_health_check():
    """Kiểm tra endpoint sức khỏe của hệ thống"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "order-service"}

@patch("app.routes.httpx.AsyncClient.post")
@patch("app.routes.publish_order_created")
def test_create_order_success(mock_kafka, mock_httpx, mock_db, mock_user):
    """
    Kiểm tra luồng tạo đơn hàng thành công:
    - Giả lập phản hồi từ Inventory Service (còn hàng).
    - Giả lập việc lưu vào DB thành công.
    - Kiểm tra xem message có được gửi vào Kafka hay không.
    """
    # Cấu hình mock cho việc kiểm tra tồn kho (Inventory Validation)
    mock_httpx.return_value = MagicMock(
        status_code=200,
        json=lambda: {
            "available": True,
            "items": [
                {"book_id": "book1", "title": "Book 1", "price": 10.0, "requested": 2, "available": True}
            ]
        }
    )
    
    # Cấu hình mock cho thao tác Insert vào MongoDB
    mock_db.orders.insert_one = AsyncMock(return_value=MagicMock(inserted_id="order123"))
    
    # Dữ liệu yêu cầu tạo đơn hàng
    payload = {
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "customer_address": "123 Street",
        "items": [
            {"book_id": "book1", "title": "Book 1", "price": 10.0, "quantity": 2}
        ]
    }
    
    response = client.post("/api/orders/", json=payload)
    
    # Kiểm tra kết quả trả về và các tương tác phụ
    assert response.status_code == 201
    assert response.json()["order_id"] == "order123"
    assert mock_db.orders.insert_one.called # Đảm bảo DB được gọi
    assert mock_kafka.called                # Đảm bảo message được gửi tới Kafka

def test_create_order_empty_items(mock_user):
    """Kiểm tra trường hợp đơn hàng trống (Validation Error)"""
    payload = {
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "customer_address": "123 Street",
        "items": []
    }
    response = client.post("/api/orders/", json=payload)
    assert response.status_code == 400
    assert "at least one item" in response.json()["detail"]
