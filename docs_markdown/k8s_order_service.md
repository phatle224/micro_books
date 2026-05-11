# Giải thích Kubernetes Deployment & Service - Order Service

File `k8s/base/services/order-service.yaml` định nghĩa trái tim của hệ thống: Dịch vụ Quản lý Đơn hàng.

## 1. Deployment (Quản lý ứng dụng)

*   **Image**: `kietne1211/microbooks-order-service:latest`.
*   **Kiểm tra sức khỏe**: Sử dụng endpoint `/health` trên cổng **3001**.
*   **Cấu hình phức tạp hơn**:
    *   Dịch vụ này cần nhiều thông tin bảo mật nhất:
        *   `MONGO_URI`: Kết nối database.
        *   `JWT_SECRET`: Dùng để mã hóa và giải mã token đăng nhập của người dùng.
    *   Cả hai đều được lấy an toàn từ **Secret** (`microbooks-secrets`).
*   **Kết nối Microservices**:
    *   Lấy địa chỉ của `inventory-service` từ ConfigMap để thực hiện các cuộc gọi API kiểm tra hàng tồn kho khi tạo đơn hàng.
*   **Giám sát**: Tích hợp sẵn OpenTelemetry tương tự như Inventory Service.

## 2. Service (Kết nối mạng)

*   **Tên định danh**: `order-service`.
*   **Cổng**: Sử dụng cổng **3001**.
*   **`type: LoadBalancer`**: Phơi cổng 3001 ra bên ngoài để ứng dụng Frontend (Next.js) có thể thực hiện các lệnh đặt hàng (POST /orders).

## Vai trò trong hệ thống
Order Service là nơi tiếp nhận mọi yêu cầu từ người dùng. Nó xác thực người dùng (qua JWT), gọi Inventory Service để kiểm tra hàng, tạo đơn hàng vào DB và gửi thông báo cho các dịch vụ khác qua Kafka. Do đó, việc cấu hình `livenessProbe` và `resources` ở đây cực kỳ quan trọng để đảm bảo hệ thống không bị sập khi có nhiều người đặt hàng cùng lúc.
