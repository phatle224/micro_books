# Sử dụng base image Node.js phiên bản 20 trên nền Alpine Linux (nhẹ và bảo mật)
FROM node:20-alpine

# Thiết lập thư mục làm việc bên trong container là /app
WORKDIR /app

# Sao chép các file package.json và package-lock.json vào thư mục làm việc
# Việc copy riêng giúp tận dụng Docker cache cho các node_modules
COPY package.json package-lock.json ./

# Cài đặt các dependencies của dự án
RUN npm install

# Sao chép toàn bộ mã nguồn của project vào container
COPY . .

# Thông báo rằng container sẽ lắng nghe trên cổng 3000
EXPOSE 3000

# Lệnh để khởi chạy ứng dụng ở chế độ development
CMD ["npm", "run", "dev"]
