# Giải thích Kubernetes Deployment & Service - Inventory Service

File `k8s/base/services/inventory-service.yaml` định nghĩa cách triển khai dịch vụ Quản lý Kho hàng lên Kubernetes.

## 1. Deployment (Quản lý ứng dụng)

*   **Image**: Sử dụng `kietne1211/microbooks-inventory-service:latest`.
*   **Sức khỏe (Healthchecks)**:
    *   Sử dụng endpoint `/health` để kiểm tra trạng thái hoạt động của ứng dụng Python/FastAPI.
    *   `initialDelaySeconds`: Đợi một khoảng thời gian ngắn để app kịp khởi chạy trước khi bắt đầu kiểm tra.
*   **Giới hạn tài nguyên**:
    *   Mức tiêu thụ thấp hơn frontend: Tối đa 0.5 CPU và 256MB RAM.
*   **Cấu hình bảo mật và kết nối**:
    *   **`MONGO_URI`**: Lấy từ **Secret** (`microbooks-secrets`) để đảm bảo thông tin đăng nhập database không bị lộ trong file cấu hình.
    *   **`KAFKA_BROKER`**: Lấy từ ConfigMap chung để biết địa chỉ gửi tin nhắn.
    *   **Giám sát (OTel)**: Tự động gửi dữ liệu giám sát về OpenTelemetry Collector thông qua biến môi trường `OTEL_EXPORTER_OTLP_ENDPOINT`.

## 2. Service (Kết nối mạng)

*   **`kind: Service`**: Tạo ra một định danh mạng cố định là `inventory-service`. Các service khác chỉ cần gọi tên này thay vì dùng IP.
*   **Port**: Chạy trên cổng **3002**.
*   **`type: LoadBalancer`**: Cho phép truy cập trực tiếp từ bên ngoài nếu cần thiết (phục vụ mục đích test hoặc debug).

## Điểm quan trọng
Inventory Service được thiết kế để "im lặng" phục vụ phía sau. Nó kết nối với Database và Kafka để cập nhật số lượng sách trong kho mỗi khi có đơn hàng mới từ Order Service thông qua hệ thống tin nhắn (Messaging).
