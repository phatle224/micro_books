# Giải thích Dockerfile - Order Service

File `order_service/Dockerfile` định nghĩa cách đóng gói dịch vụ Quản lý Đơn hàng (Python/FastAPI) thành một Docker image.

## Chi tiết các câu lệnh

1.  **`FROM python:3.11-slim`**
    *   Sử dụng base image Python 3.11 phiên bản rút gọn (`slim`) để tiết kiệm không gian đĩa.

2.  **`WORKDIR /app`**
    *   Tạo và chuyển vào thư mục làm việc `/app`.

3.  **`COPY requirements.txt .`**
    *   Copy file danh sách thư viện vào trước để tận dụng layer caching của Docker.

4.  **`RUN pip install --no-cache-dir -r requirements.txt`**
    *   Cài đặt các dependencies cần thiết cho service.

5.  **`COPY . .`**
    *   Copy toàn bộ mã nguồn của Order Service vào container.

6.  **`EXPOSE 3001`**
    *   Khai báo cổng 3001 cho Order Service.

7.  **`CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3001", "--reload"]`**
    *   Lệnh khởi chạy backend server:
        *   Chạy bằng `uvicorn` trên cổng 3001.
        *   Chế độ `--reload` cho phép nhận diện thay đổi code ngay lập tức.

## So sánh với Inventory Service
* Cấu trúc hoàn toàn tương tự Inventory Service vì cả hai đều dùng FastAPI.
* Điểm khác biệt duy nhất là **Cổng (Port)**: Order Service dùng cổng **3001**, trong khi Inventory Service dùng cổng **3002**.
