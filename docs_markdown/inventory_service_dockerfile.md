# Giải thích Dockerfile - Inventory Service

File `inventory_service/Dockerfile` định nghĩa cách đóng gói dịch vụ Quản lý Kho hàng (Python/FastAPI) thành một Docker image.

## Chi tiết các câu lệnh

1.  **`FROM python:3.11-slim`**
    *   Sử dụng base image Python phiên bản 3.11.
    *   `slim` là phiên bản rút gọn, loại bỏ các gói phần mềm không cần thiết để giảm dung lượng image nhưng vẫn đủ dùng cho Python backend.

2.  **`WORKDIR /app`**
    *   Thiết lập `/app` làm thư mục gốc cho các lệnh chạy trong container.

3.  **`COPY requirements.txt .`**
    *   Sao chép file danh sách thư viện Python cần thiết vào container.

4.  **`RUN pip install --no-cache-dir -r requirements.txt`**
    *   Cài đặt các thư viện Python.
    *   `--no-cache-dir` giúp Docker không lưu lại bộ nhớ đệm của pip, làm image nhẹ hơn nữa.

5.  **`COPY . .`**
    *   Sao chép toàn bộ code của microservice vào container.

6.  **`EXPOSE 3002`**
    *   Khai báo cổng 3002 là cổng mà dịch vụ này sẽ chạy.

7.  **`CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3002", "--reload"]`**
    *   Lệnh thực thi khi container khởi chạy:
        *   `uvicorn`: Server chạy ASGI cho FastAPI.
        *   `app.main:app`: Chỉ định file và biến khởi tạo ứng dụng.
        *   `--host 0.0.0.0`: Cho phép container nhận kết nối từ bên ngoài.
        *   `--reload`: Tự động tải lại khi code thay đổi (phù hợp cho môi trường phát triển).

## Đặc điểm nổi bật
* Sử dụng ảnh cơ sở gọn nhẹ (`slim`).
* Tối ưu hóa dung lượng bằng cách không lưu cache của pip.
* Hỗ trợ Hot-reload để lập trình nhanh chóng.
