# Giải thích Dockerfile - Frontend

File `frontend/Dockerfile` được sử dụng để xây dựng Docker image cho ứng dụng Frontend (Next.js). Dưới đây là giải thích chi tiết từng dòng lệnh:

## Chi tiết các câu lệnh

1.  **`FROM node:20-alpine`**
    *   Sử dụng base image là Node.js phiên bản 20.
    *   `alpine` là một phiên bản Linux cực kỳ nhẹ và bảo mật, giúp giảm kích thước image cuối cùng.

2.  **`WORKDIR /app`**
    *   Thiết lập thư mục làm việc mặc định bên trong container là `/app`. Tất cả các lệnh tiếp theo sẽ được thực hiện tại đây.

3.  **`COPY package.json package-lock.json ./`**
    *   Sao chép các file quản lý thư viện vào container trước.
    *   **Lý do:** Docker sử dụng cơ chế layer caching. Nếu file `package.json` không thay đổi, Docker sẽ sử dụng lại layer đã cài đặt thư viện ở bước tiếp theo, giúp tiết kiệm thời gian build.

4.  **`RUN npm install`**
    *   Thực hiện cài đặt tất cả các thư viện (dependencies) được liệt kê trong `package.json`.

5.  **`COPY . .`**
    *   Sao chép toàn bộ mã nguồn còn lại từ máy host vào thư mục làm việc trong container.

6.  **`EXPOSE 3000`**
    *   Thông báo rằng container này sẽ lắng nghe các kết nối trên cổng 3000. Lưu ý: lệnh này chỉ mang tính chất tài liệu, bạn vẫn cần map port khi chạy container.

7.  **`CMD ["npm", "run", "dev"]`**
    *   Lệnh mặc định để chạy khi container khởi động. Ở đây là chạy ứng dụng ở chế độ phát triển (development mode).

## Tóm tắt quy trình build
1. Chọn môi trường chạy (Node.js).
2. Chuẩn bị thư mục làm việc.
3. Cài đặt thư viện (tận dụng cache).
4. Copy mã nguồn.
5. Khởi chạy ứng dụng.
