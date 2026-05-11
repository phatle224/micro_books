# Giải thích các loại Test trong Microbooks

## 1. Linting

**Linting không chạy code — chỉ đọc và kiểm tra hình thức.**

Trong CI/CD (`ci-cd.yml:40-41`), lệnh chạy là:

```bash
flake8 . --select=E9,F63,F7,F82   # lỗi nghiêm trọng (syntax, undefined name)
flake8 . --max-line-length=127     # lỗi style (dòng quá dài, v.v.)
```

| Mã lỗi | Ý nghĩa | Ví dụ |
|---|---|---|
| `F82` | Dùng biến chưa khai báo | `print(resposne)` — typo tên biến |
| `E9` | Lỗi cú pháp | `def foo( :` |
| `W` | Vi phạm style | Dòng dài hơn 127 ký tự |

**Mục đích:** Bắt lỗi ngớ ngẩn trước khi chạy bất kỳ test nào. Nhanh nhất (~2 giây).

---

## 2. Unit Tests

**Chạy từng hàm độc lập, mock hết mọi thứ bên ngoài (DB, Kafka, HTTP).**

### `order_service/tests/test_auth.py` — test logic thuần túy

```python
def test_password_hashing():
    hashed = hash_password("secret_password")
    assert verify_password("secret_password", hashed) is True   # đúng password
    assert verify_password("wrong_password",  hashed) is False  # sai password
```

Không cần DB, không cần mạng — chỉ kiểm tra hàm `hash_password` có hoạt động đúng không.

### `inventory_service/tests/test_models.py` — test validation model

```python
def test_book_create_validation():
    with pytest.raises(ValidationError):
        BookCreate(title="Missing Author", price=19.99)  # thiếu author -> phải báo lỗi
```

Kiểm tra Pydantic model có từ chối dữ liệu sai không.

### `order_service/tests/test_api.py` — test API endpoint nhưng mock DB và Kafka

```python
with patch("motor.motor_asyncio.AsyncIOMotorClient"):  # giả MongoDB
    from app.main import app

@patch("app.routes.httpx.AsyncClient.post")      # giả HTTP call tới inventory
@patch("app.routes.publish_order_created")        # giả Kafka
def test_create_order_success(mock_kafka, mock_httpx, mock_db, mock_user):
    response = client.post("/api/orders/", json=payload)
    assert response.status_code == 201
```

> **Tại sao mock?** Vì unit test phải chạy được offline, không cần Docker — chỉ kiểm tra logic của service đó thôi.

---

## 3. Integration Tests

**Chạy với hệ thống thật — MongoDB thật, Kafka thật, service thật.**

### Hạ tầng CI cần chuẩn bị trước (`ci-cd.yml:62-101`)

```
1. Khởi động MongoDB container thật
2. Khởi động Kafka + Zookeeper thật
3. Chạy order_service + inventory_service bằng uvicorn
4. Chờ 15-20 giây cho các service sẵn sàng
5. Mới chạy tests/test_order_flow.py
```

### Luồng test (`tests/test_order_flow.py`)

```python
def test_order_and_inventory_flow():
    # 1. Gọi API inventory lấy sách thật
    books_res = requests.get("http://localhost:3002/api/books")
    initial_stock = test_book["stock"]

    # 2. Tạo đơn hàng thật
    order_res = requests.post("http://localhost:3001/api/orders", json=order_data)

    # 3. Đợi 3 giây cho Kafka xử lý event
    time.sleep(3)

    # 4. Kiểm tra tồn kho đã giảm chưa
    updated_stock = requests.get(f"/api/books/{book_id}").json()["stock"]
    assert updated_stock == initial_stock - 1  # Kafka đã chạy -> inventory đã trừ kho
```

Test này xác minh toàn bộ luồng **Order → Kafka → Inventory** hoạt động end-to-end.

---

## So sánh tổng quan

| | Linting | Unit Test | Integration Test |
|---|---|---|---|
| **Chạy code thật?** | Không | Có | Có |
| **Cần Docker?** | Không | Không | Có |
| **Mock?** | Không áp dụng | Mock DB, Kafka, HTTP | Không mock gì |
| **Tốc độ** | ~2 giây | ~10 giây | ~2 phút |
| **Kiểm tra** | Hình thức code | Từng hàm/endpoint | Luồng liên service |
| **Tool** | `flake8` | `pytest` | `pytest` / `python` |
| **Files** | Toàn bộ `.py` | `*/tests/test_*.py` | `tests/test_order_flow.py` |

## Thứ tự chạy trong CI

```
Lint  ──►  Unit Test  ──►  Integration Test  ──►  Docker Build & Push
```

Nếu bước trước fail → dừng lại, không chạy bước sau (tiết kiệm thời gian và tài nguyên).
