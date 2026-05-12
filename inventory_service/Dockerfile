# Sử dụng image Python phiên bản 3.11 nhẹ (slim) làm nền tảng
FROM python:3.11-slim

# Thiết lập thư mục làm việc bên trong container là /app
WORKDIR /app

# Sao chép file requirements.txt vào container
COPY requirements.txt .

# Cài đặt các thư viện Python cần thiết, không lưu cache để giảm dung lượng image
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép toàn bộ mã nguồn của service vào thư mục làm việc
COPY . .

# Thông báo container sẽ lắng nghe trên cổng 3002
EXPOSE 3002

# Lệnh khởi chạy server Uvicorn với chế độ reload (thích hợp cho phát triển)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3002", "--reload"]
