import requests
import time
import json

# Các URL API của các dịch vụ chạy trong Docker/CI
ORDER_SERVICE_URL = "http://localhost:3001/api/orders"
INVENTORY_SERVICE_URL = "http://localhost:3002/api/books"
AUTH_SERVICE_URL = "http://localhost:3001/api/auth"

def get_auth_token(email: str, password: str, name: str = "Test User") -> str:
    """
    Hàm hỗ trợ lấy JWT token bằng cách Đăng ký mới hoặc Đăng nhập.
    Tự động thử lại tối đa 5 lần vì trong môi trường CI, dịch vụ có thể khởi động chậm.
    """
    for attempt in range(5):
        try:
            # 1. Thử đăng ký tài khoản mới trước
            register_payload = {"name": name, "email": email, "password": password}
            register_res = requests.post(f"{AUTH_SERVICE_URL}/register", json=register_payload, timeout=5)
            
            if register_res.status_code == 201:
                print(f"DEBUG: Đăng ký tài khoản mới thành công ({email})")
                return register_res.json().get("access_token", "")
            
            # 2. Nếu đăng ký báo lỗi (có thể do tài khoản đã tồn tại từ lần chạy trước), thử đăng nhập
            login_payload = {"email": email, "password": password}
            login_res = requests.post(f"{AUTH_SERVICE_URL}/login", json=login_payload, timeout=5)
            
            if login_res.status_code == 200:
                print(f"DEBUG: Đăng nhập thành công ({email})")
                return login_res.json().get("access_token", "")
            
            print(f"DEBUG: Thử lần {attempt+1} - Đăng ký: {register_res.status_code}, Đăng nhập: {login_res.status_code}")
            
        except Exception as e:
            print(f"DEBUG: Thử lần {attempt+1} - Lỗi kết nối: {e}")
        
        time.sleep(2) # Đợi 2 giây trước khi thử lại

    raise RuntimeError(f"Xác thực thất bại sau 5 lần thử cho {email}")

def test_order_and_inventory_flow():
    """
    Kịch bản Integration Test chính:
    1. Kiểm tra Inventory để lấy 1 cuốn sách còn hàng.
    2. Gọi Order Service để đặt mua cuốn sách đó.
    3. Đợi Kafka truyền message từ Order sang Inventory.
    4. Kiểm tra lại Inventory xem tồn kho có bị trừ đi 1 hay không.
    """
    print("--- Bắt đầu kiểm thử luồng Order -> Kafka -> Inventory ---")

    # 1. Lấy danh sách sách từ Inventory Service
    print("\n[BƯỚC 1] Lấy danh sách sách từ Inventory...")
    try:
        books_res = requests.get(INVENTORY_SERVICE_URL, timeout=5)
    except Exception as e:
        print(f"FAILED: Không thể kết nối tới Inventory Service: {e}")
        return

    if books_res.status_code != 200:
        print(f"FAILED: Inventory Service trả về mã lỗi {books_res.status_code}")
        return

    books = books_res.json().get("books", [])
    if not books:
        print("FAILED: Không tìm thấy sách nào trong cơ sở dữ liệu để kiểm thử")
        return

    # Tìm một cuốn sách còn hàng trong kho (stock > 0)
    test_book = next((b for b in books if b["stock"] > 0), None)
    
    if not test_book:
        print("FAILED: Tất cả các đầu sách đều đã hết hàng!")
        return

    book_id = test_book["_id"]
    initial_stock = test_book["stock"]
    print(f"Chọn sách test: {test_book['title']} (ID: {book_id})")
    print(f"Số lượng tồn kho ban đầu: {initial_stock}")

    # 2. Tạo đơn hàng thông qua Order Service
    print("\n[BƯỚC 2] Đang gửi yêu cầu tạo đơn hàng mới...")
    # Lấy token JWT để xác thực API
    token = get_auth_token("tester@example.com", "test1234")
    if not token:
        print("FAILED: Không lấy được token xác thực")
        return

    # Dữ liệu đơn hàng mẫu
    order_data = {
        "customer_name": "Antigravity Tester",
        "customer_email": "tester@example.com",
        "customer_phone": "0987654321",
        "customer_address": "123 AI Street",
        "items": [
            {
                "book_id": book_id,
                "title": test_book["title"],
                "price": test_book["price"],
                "quantity": 1
            }
        ]
    }
    
    try:
        order_res = requests.post(
            ORDER_SERVICE_URL,
            json=order_data,
            timeout=5,
            headers={"Authorization": f"Bearer {token}"},
        )
    except Exception as e:
        print(f"FAILED: Không thể kết nối tới Order Service: {e}")
        return

    if order_res.status_code != 201:
        print(f"FAILED: Tạo đơn hàng thất bại: {order_res.text}")
        return
    
    order_id = order_res.json()["order_id"]
    print(f"SUCCESS: Đơn hàng được tạo thành công! ID: {order_id}")

    # 3. Chờ đợi quá trình xử lý bất đồng bộ
    # Sau khi đơn hàng tạo xong, Order Service sẽ gửi message vào Kafka.
    # Inventory Service sẽ consume message này và cập nhật tồn kho.
    print("\n[BƯỚC 3] Đợi 3 giây để hệ thống xử lý qua Kafka...")
    time.sleep(3)

    # 4. Kiểm tra lại tồn kho sau khi xử lý
    print("\n[BƯỚC 4] Kiểm tra tồn kho sau khi đặt hàng...")
    try:
        book_check_res = requests.get(f"{INVENTORY_SERVICE_URL}/{book_id}", timeout=5)
        updated_stock = book_check_res.json()["stock"]
    except Exception as e:
        print(f"FAILED: Không thể kiểm tra lại số lượng tồn kho: {e}")
        return
    
    print(f"Số lượng tồn kho mới: {updated_stock}")
    
    # Kiểm tra logic: Tồn kho mới phải bằng Tồn kho cũ - 1
    if updated_stock == initial_stock - 1:
        print("\n===> KẾT QUẢ CUỐI CÙNG: THÀNH CÔNG! Luồng Event-Driven (Kafka) hoạt động chính xác.")
    else:
        print(f"\n===> KẾT QUẢ CUỐI CÙNG: THẤT BẠI. Tồn kho không giảm (Mong đợi: {initial_stock-1}, Thực tế: {updated_stock})")

if __name__ == "__main__":
    test_order_and_inventory_flow()
