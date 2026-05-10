# Sử dụng base image Python 3.11 bản slim (nhẹ hơn bản full)
FROM python:3.11-slim

# Thiết lập thư mục làm việc trong container là /app
WORKDIR /app

# Sao chép file requirements.txt vào container
COPY requirements.txt .

# Cài đặt các thư viện Python cần thiết, --no-cache-dir giúp giảm dung lượng image
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép toàn bộ mã nguồn của service vào container
COPY . .

# Thông báo container lắng nghe trên cổng 3002
EXPOSE 3002

# Lệnh khởi chạy server uvicorn cho FastAPI với chế độ reload khi code thay đổi
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3002", "--reload"]
