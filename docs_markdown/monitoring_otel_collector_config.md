# Giải thích Cấu hình OpenTelemetry Collector

File `k8s/base/config/monitoring/otel-collector-config.yml` là trái tim của hệ thống giám sát, điều phối toàn bộ luồng dữ liệu Traces và Metrics.

## Quy trình xử lý dữ liệu (Pipelines)

Dữ liệu đi qua Collector theo 3 bước: **Receivers -> Processors -> Exporters**.

### 1. Receivers (Đầu nhận)
*   Sử dụng giao thức **OTLP** (OpenTelemetry Protocol) trên cả hai cổng **4317** (gRPC) và **4318** (HTTP). Đây là nơi các Microservices gửi dữ liệu giám sát tới.

### 2. Processors (Bộ xử lý)
*   **`batch`**: Gom dữ liệu thành từng đợt mỗi 5 giây để giảm tải cho hệ thống mạng.
*   **`memory_limiter`**: Đảm bảo collector không ngốn quá nhiều RAM gây sập hệ thống (giới hạn ở 80%).
*   **`resourcedetection`**: Tự động gắn thêm các thông tin về môi trường (như tên Pod, tên Node) vào dữ liệu để dễ dàng phân loại.

### 3. Exporters (Đầu đẩy)
*   **`otlp/tempo`**: Đẩy dữ liệu Trace sang hệ thống Tempo.
*   **`prometheus`**: Mở một cổng (`8889`) để Prometheus có thể vào lấy dữ liệu Metrics đã được chuẩn hóa.
*   **`logging`**: Ghi lại các hoạt động của collector để phục vụ việc kiểm tra lỗi (debug).

## Tại sao cần Collector?
Collector giúp các Microservices "nhẹ gánh" hơn. Thay vì mỗi dịch vụ phải tự mình gửi dữ liệu đến 3 nơi khác nhau (Prometheus, Loki, Tempo), chúng chỉ cần gửi duy nhất một lần tới Collector theo chuẩn chung. Collector sẽ lo phần còn lại.
