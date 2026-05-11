# Giải thích Nguồn dữ liệu Grafana (Datasources)

File `k8s/base/config/monitoring/datasources.yml` thiết lập các kết nối tự động từ Grafana tới các cơ sở dữ liệu giám sát trong hệ thống.

## Các nguồn dữ liệu được cấu hình

### 1. Prometheus (Metrics)
*   **Địa chỉ**: `http://prometheus:9090`
*   **Vai trò**: Cung cấp các chỉ số về CPU, RAM và hiệu năng hệ thống. Đây là nguồn dữ liệu mặc định (`isDefault: true`).

### 2. Loki (Logs)
*   **Địa chỉ**: `http://loki:3100`
*   **Vai trò**: Cung cấp toàn bộ nhật ký hệ thống (Logs) từ các container.

### 3. Tempo (Traces)
*   **Địa chỉ**: `http://tempo:3200`
*   **Vai trò**: Cung cấp dữ liệu theo dõi vết request (Tracing).
*   **Tính năng nâng cao (Liên kết chéo)**:
    *   **Service Map**: Sử dụng dữ liệu từ Prometheus để vẽ sơ đồ tương tác giữa các dịch vụ.
    *   **Traces to Logs**: Khi bạn xem một "vết" request bị lỗi, Grafana cho phép bạn bấm vào đó để xem ngay các dòng Log tương ứng trong Loki nhờ sự liên kết qua `traceID`.

## Tóm tắt
File cấu hình này tạo nên sức mạnh "Hợp nhất quan sát" (Unified Observability). Bạn có thể đi từ biểu đồ Metrics sang xem Logs và đào sâu vào Traces chỉ trong một giao diện duy nhất mà không cần chuyển đổi công cụ thủ công.
