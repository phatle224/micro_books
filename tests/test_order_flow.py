import requests
import time
import json

ORDER_SERVICE_URL = "http://localhost:3001/api/orders"
INVENTORY_SERVICE_URL = "http://localhost:3002/api/books"
AUTH_SERVICE_URL = "http://localhost:3001/api/auth"


def get_auth_token(email: str, password: str, name: str = "Test User") -> str:
    register_payload = {"name": name, "email": email, "password": password}
    register_res = requests.post(f"{AUTH_SERVICE_URL}/register", json=register_payload, timeout=5)

    if register_res.status_code == 201:
        return register_res.json().get("access_token", "")

    login_payload = {"email": email, "password": password}
    login_res = requests.post(f"{AUTH_SERVICE_URL}/login", json=login_payload, timeout=5)
    if login_res.status_code != 200:
        raise RuntimeError(f"Auth failed: {login_res.text}")

    return login_res.json().get("access_token", "")

def test_order_and_inventory_flow():
    print("--- Bat dau test luong Order -> Kafka -> Inventory ---")

    # 1. Lay danh sach sach de chon 1 cuon test
    print("\n[1] Lay danh sach sach tu Inventory...")
    try:
        books_res = requests.get(INVENTORY_SERVICE_URL, timeout=5)
    except Exception as e:
        print(f"FAILED: Khong the ket noi toi Inventory Service: {e}")
        return

    if books_res.status_code != 200:
        print(f"FAILED: Inventory Service tra ve loi {books_res.status_code}")
        return

    books = books_res.json().get("books", [])
    if not books:
        print("FAILED: Khong co sach nao trong kho de test")
        return

    # Tim cuon sach con hang (stock > 0)
    test_book = next((b for b in books if b["stock"] > 0), None)
    
    if not test_book:
        print("FAILED: Tat ca sach deu het hang!")
        return

    book_id = test_book["_id"]
    initial_stock = test_book["stock"]
    print(f"Chon sach: {test_book['title']} (ID: {book_id})")
    print(f"Ton kho hien tai: {initial_stock}")

    # 2. Tao don hang
    print("\n[2] Dang tao don hang moi...")
    token = get_auth_token("tester@example.com", "test1234")
    if not token:
        print("FAILED: Khong nhan duoc token")
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
        print(f"FAILED: Khong the ket noi toi Order Service: {e}")
        return

    if order_res.status_code != 201:
        print(f"FAILED: Loi tao don hang: {order_res.text}")
        return
    
    order_id = order_res.json()["order_id"]
    print(f"SUCCESS: Don hang da tao! ID: {order_id}")

    # 3. Doi Kafka xu ly
    print("\n[3] Doi 3 giay de Kafka va Inventory xu ly...")
    time.sleep(3)

    # 4. Kiem tra lai ton kho
    print("\n[4] Kiem tra ton kho sau khi tao don hang...")
    try:
        book_check_res = requests.get(f"{INVENTORY_SERVICE_URL}/{book_id}", timeout=5)
        updated_stock = book_check_res.json()["stock"]
    except Exception as e:
        print(f"FAILED: Khong the kiem tra lai ton kho: {e}")
        return
    
    print(f"Ton kho moi: {updated_stock}")
    
    if updated_stock == initial_stock - 1:
        print("\n===> KET QUA: THANH CONG! Luong Event-Driven hoat dong tot.")
    else:
        print("\n===> KET QUA: THAT BAI. Ton kho khong thay doi.")

if __name__ == "__main__":
    test_order_and_inventory_flow()
