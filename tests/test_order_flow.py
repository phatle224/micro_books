import requests
import time
import json

ORDER_SERVICE_URL = "http://localhost:3001/api/orders"
INVENTORY_SERVICE_URL = "http://localhost:3002/api/books"
AUTH_SERVICE_URL = "http://localhost:3001/api/auth"


def get_auth_token(email: str, password: str, name: str = "Test User") -> str:
    # Thử lại nhiều lần vì trong CI dịch vụ có thể khởi động chậm
    for attempt in range(5):
        try:
            # 1. Thử đăng ký trước
            register_payload = {"name": name, "email": email, "password": password}
            register_res = requests.post(f"{AUTH_SERVICE_URL}/register", json=register_payload, timeout=5)
            
            if register_res.status_code == 201:
                print(f"DEBUG: Đăng ký tài khoản mới thành công ({email})")
                return register_res.json().get("access_token", "")
            
            # 2. Nếu đăng ký báo lỗi (có thể do tồn tại rồi), thử đăng nhập
            login_payload = {"email": email, "password": password}
            login_res = requests.post(f"{AUTH_SERVICE_URL}/login", json=login_payload, timeout=5)
            
            if login_res.status_code == 200:
                print(f"DEBUG: Đăng nhập thành công ({email})")
                return login_res.json().get("access_token", "")
            
            print(f"DEBUG: Attempt {attempt+1} - Register status: {register_res.status_code}, Login status: {login_res.status_code}")
            
        except Exception as e:
            print(f"DEBUG: Attempt {attempt+1} - Connection failed: {e}")
        
        time.sleep(2) # Đợi 2 giây trước khi thử lại

    raise RuntimeError(f"Auth failed after 5 attempts for {email}")

def test_order_and_inventory_flow():
    print("--- Bắt đầu test luồng Order -> Kafka -> Inventory ---")

    # 1. Lấy danh sách sách để chọn 1 cuốn test
    print("\n[1] Lấy danh sách sách từ Inventory...")
    try:
        books_res = requests.get(INVENTORY_SERVICE_URL, timeout=5)
    except Exception as e:
        print(f"FAILED: Không thể kết nối tới Inventory Service: {e}")
        return

    if books_res.status_code != 200:
        print(f"FAILED: Inventory Service trả về lỗi {books_res.status_code}")
        return

    books = books_res.json().get("books", [])
    if not books:
        print("FAILED: Không có sách nào trong kho để test")
        return

    # Tìm cuốn sách còn hàng (stock > 0)
    test_book = next((b for b in books if b["stock"] > 0), None)
    
    if not test_book:
        print("FAILED: Tất cả sách đều hết hàng!")
        return

    book_id = test_book["_id"]
    initial_stock = test_book["stock"]
    print(f"Chọn sách: {test_book['title']} (ID: {book_id})")
    print(f"Tồn kho hiện tại: {initial_stock}")

    # 2. Tạo đơn hàng
    print("\n[2] Đang tạo đơn hàng mới...")
    token = get_auth_token("tester@example.com", "test1234")
    if not token:
        print("FAILED: Không nhận được token")
        return

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
        print(f"FAILED: Lỗi tạo đơn hàng: {order_res.text}")
        return
    
    order_id = order_res.json()["order_id"]
    print(f"SUCCESS: Đơn hàng đã tạo! ID: {order_id}")

    # 3. Đợi Kafka xử lý
    print("\n[3] Đợi 3 giây để Kafka và Inventory xử lý...")
    time.sleep(3)

    # 4. Kiểm tra lại tồn kho
    print("\n[4] Kiểm tra tồn kho sau khi tạo đơn hàng...")
    try:
        book_check_res = requests.get(f"{INVENTORY_SERVICE_URL}/{book_id}", timeout=5)
        updated_stock = book_check_res.json()["stock"]
    except Exception as e:
        print(f"FAILED: Không thể kiểm tra lại tồn kho: {e}")
        return
    
    print(f"Tồn kho mới: {updated_stock}")
    
    if updated_stock == initial_stock - 1:
        print("\n===> KẾT QUẢ: THÀNH CÔNG! Luồng Event-Driven hoạt động tốt.")
    else:
        print("\n===> KẾT QUẢ: THẤT BẠI. Tồn kho không thay đổi.")

if __name__ == "__main__":
    test_order_and_inventory_flow()
