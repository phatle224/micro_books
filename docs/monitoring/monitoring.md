# Hệ thống Monitoring MicroBooks

Tài liệu này hướng dẫn chi tiết về các cơ chế theo dõi (monitoring), lưu vết (tracing) và thu thập log đang được thiết lập trong project.

## 1. Kiến trúc Tổng quan (LGTM Stack)

Hệ thống sử dụng bộ công cụ **LGTM** kết hợp với tiêu chuẩn **OpenTelemetry**:
- **L**oki: Quản lý và truy vấn Log.
- **G**rafana: Giao diện trực quan hóa dữ liệu (Dashboard).
- **T**empo: Quản lý Distributed Tracing.
- **M**etrics (Prometheus): Lưu trữ các chỉ số hiệu năng.

## 2. Các thành phần chính

### OpenTelemetry Collector
Đóng vai trò là "trạm trung chuyển" dữ liệu.
- **Receivers:** Nhận dữ liệu từ các service qua cổng `4317` (gRPC) và `4318` (HTTP).
- **Processors:** Xử lý dữ liệu (batching, lọc, gắn nhãn).
- **Exporters:** Đẩy dữ liệu sang Prometheus (Metrics) và Tempo (Traces).

### Prometheus (Metrics)
- Scrape dữ liệu từ OTEL Collector tại cổng `8889`.
- Lưu trữ các chỉ số như: số lượng request, thời gian phản hồi, lỗi 5xx/4xx.

### Tempo (Tracing)
- Lưu trữ các "vết" (traces) của request.
- Cho phép bạn xem một request đã đi qua những đâu (ví dụ: từ Order Service sang Inventory Service).

### Loki & Promtail (Logging)
- **Promtail:** Quét tất cả log từ Docker containers thông qua Docker Socket.
- **Loki:** Lưu trữ log tập trung, hỗ trợ truy vấn mạnh mẽ giống như Prometheus.

### Grafana (Visualization)
- Điểm truy cập duy nhất tại: [http://localhost:3005](http://localhost:3005) (Admin/Admin).
- Tích hợp sẵn các Data Source: Prometheus, Loki, Tempo.

## 3. Cách kiểm tra hệ thống hoạt động

1. **Xem Log:** Vào Grafana -> Explore -> Chọn **Loki** -> Chọn label `container_name`.
2. **Xem Traces:** Vào Grafana -> Explore -> Chọn **Tempo**. Bạn có thể tìm các trace ID từ log của Loki để xem chi tiết luồng đi.
3. **Xem Metrics:** Vào Grafana -> Explore -> Chọn **Prometheus** -> Tìm các metric có tiền tố `microbooks_`.

## 4. Cấu hình chi tiết
Các file cấu hình được lưu tại thư mục `/monitoring`:
- `otel-collector-config.yml`: Cấu hình luồng dữ liệu OTEL.
- `prometheus.yml`: Cấu hình scrape targets.
- `loki-config.yml`: Cấu hình lưu trữ log.
- `promtail-config.yml`: Cấu hình thu thập log từ Docker.
