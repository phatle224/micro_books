# Giải thích Cấu hình Theo dõi Trace (Tempo)

File `k8s/base/config/monitoring/tempo.yml` thiết lập hệ thống lưu trữ và phân tích các "vết" (Traces) của các request đi xuyên qua hệ thống Microservices.

## Các thành phần quan trọng

1.  **`distributor`**: Bộ phận đón nhận dữ liệu Trace từ OTel Collector thông qua giao thức chuẩn OTLP.
2.  **`ingester`**: Tiếp nhận dữ liệu và giữ chúng trong bộ nhớ tạm thời. Sau 5 phút (`max_block_duration`) hoặc khi đủ 1MB dữ liệu, nó sẽ đóng gói và ghi xuống ổ cứng.
3.  **`metrics_generator` (Tính năng cao cấp)**:
    *   Tempo tự động phân tích các Trace để tạo ra các Metrics tương ứng.
    *   **Service Graphs**: Tự động vẽ sơ đồ kết nối giữa các dịch vụ (ví dụ: thấy mũi tên từ `order-service` trỏ sang `inventory-service`).
    *   Dữ liệu này được đẩy ngược lại Prometheus để bạn có thể xem biểu đồ sơ đồ dịch vụ ngay trên Grafana.
4.  **`storage`**: Dữ liệu Trace được lưu giữ trong vòng **24 giờ** (`block_retention`). Do dữ liệu Trace thường rất lớn, việc giới hạn thời gian giúp hệ thống không bị đầy ổ cứng.

## Tại sao cần Tempo?
Nếu hệ thống bị chậm, Prometheus chỉ cho bạn biết "ứng dụng đang chậm". Còn Tempo sẽ chỉ chính xác cho bạn biết "chậm ở bước gọi sang cơ sở dữ liệu" hay "chậm ở bước gửi tin nhắn Kafka". Đây là công cụ tối thượng để tối ưu hiệu năng hệ thống.
