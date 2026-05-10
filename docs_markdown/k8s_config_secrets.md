# Giải thích Kubernetes Secrets

File `k8s/base/config/secrets.yaml` được sử dụng để lưu trữ các thông tin nhạy cảm của dự án một cách an toàn bên trong Cluster.

## Các dữ liệu được lưu trữ

1.  **`MONGO_URI`**: Chuỗi kết nối đến cơ sở dữ liệu MongoDB Atlas. Việc để thông tin này trong Secret giúp tránh lộ mật khẩu database khi chia sẻ mã nguồn.
2.  **`JWT_SECRET`**: Khóa bí mật dùng để ký và xác thực các JSON Web Token (JWT). Đây là thành phần cực kỳ quan trọng cho hệ thống bảo mật.
3.  **`ADMIN_EMAIL` & `ADMIN_PASSWORD`**: Thông tin đăng nhập mặc định cho tài khoản quản trị viên của hệ thống.

## Đặc điểm kỹ thuật
*   **`type: Opaque`**: Đây là loại Secret mặc định, cho phép lưu trữ các cặp key-value tùy ý.
*   **`stringData`**: Một tính năng tiện lợi giúp bạn viết trực tiếp giá trị bằng văn bản thường (plain text). Kubernetes sẽ tự động mã hóa chúng sang dạng **Base64** khi lưu vào cơ sở dữ liệu của Cluster.

## Cách sử dụng
Các dịch vụ như `order-service` và `inventory-service` sẽ tham chiếu đến Secret này thông qua biến môi trường để lấy thông tin kết nối mà không cần ghi cứng (hard-code) vào mã nguồn.
