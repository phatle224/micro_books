# Giải thích Kubernetes ConfigMap

File `k8s/base/config/configmap.yaml` dùng để lưu trữ các tham số cấu hình chung mà tất cả các microservices trong hệ thống cần biết.

## Các thông tin cấu hình

ConfigMap này đóng vai trò như một danh bạ điện thoại, giúp các dịch vụ tìm thấy nhau:

1.  **`KAFKA_BROKER`**: Địa chỉ kết nối đến cụm Kafka (`kafka-service:9092`).
2.  **Service URLs**:
    *   `ORDER_SERVICE_URL`: Địa chỉ gọi API của dịch vụ đơn hàng.
    *   `INVENTORY_SERVICE_URL`: Địa chỉ gọi API của dịch vụ kho hàng.
3.  **Ports**: Khai báo các cổng mặc định cho Frontend (3000), Order (3001) và Inventory (3002).
4.  **`OTEL_EXPORTER_OTLP_ENDPOINT`**: Địa chỉ của trạm thu thập dữ liệu giám sát OpenTelemetry.

## Tại sao sử dụng ConfigMap?
*   **Tách biệt cấu hình và mã nguồn**: Bạn có thể thay đổi cổng hoặc địa chỉ IP của một dịch vụ chỉ bằng cách sửa file này và áp dụng lại, mà không cần phải build lại Docker image cho ứng dụng.
*   **Quản lý tập trung**: Thay vì phải cấu hình địa chỉ Kafka ở 3 nơi khác nhau, bạn chỉ cần cấu hình 1 lần duy nhất tại đây.
*   **Chia sẻ dễ dàng**: Tất cả các Pod trong Namespace `microbooks` đều có thể đọc được các thông tin này.

## So sánh với Secret
*   **ConfigMap**: Dùng cho dữ liệu thông thường, công khai (URL, Port, Log Level).
*   **Secret**: Dùng cho dữ liệu nhạy cảm, cần bảo mật (Password, API Key, Token).
