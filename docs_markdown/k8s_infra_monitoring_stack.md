# Giải thích Hệ thống Giám sát Toàn diện (Monitoring Stack)

File `infrastructure/monitoring.yaml` chứa toàn bộ "bộ não" quan sát của dự án. Hệ thống này thu thập mọi dấu vết (Trace), nhật ký (Log) và chỉ số (Metric) của các Microservices.

## 1. OpenTelemetry (OTel) Collector
*   **Vai trò:** Trạm trung chuyển dữ liệu.
*   **Cơ chế:** Nhận dữ liệu từ các ứng dụng (qua cổng 4317/4318) sau đó phân loại và đẩy về đúng nơi lưu trữ (Loki cho logs, Tempo cho traces, Prometheus cho metrics).

## 2. Prometheus
*   **Vai trò:** Cơ sở dữ liệu cho các chỉ số (Metrics).
*   **Cơ chế:** Quét (pull) dữ liệu từ OTel Collector và các service khác để lưu trữ theo dòng thời gian. Nó cung cấp dữ liệu cho các biểu đồ về hiệu năng CPU, RAM, số lượng request.

## 3. Grafana
*   **Vai trò:** Giao diện Dashboard tổng hợp.
*   **Truy cập:** Cổng `3005`.
*   **Đặc điểm:** Đã được cấu hình tự động (Provisioning) để kết nối sẵn với Prometheus, Loki, Tempo ngay khi vừa khởi động. Bạn không cần phải thêm nguồn dữ liệu thủ công.

## 4. Loki & Promtail
*   **Loki:** Hệ thống lưu trữ Log tập trung (tương tự Google cho Logs).
*   **Promtail:** Agent chạy trên từng máy chủ để "thu gom" log từ các container Docker và đẩy về Loki.

## 5. Tempo
*   **Vai trò:** Lưu trữ Traces (Dấu vết request).
*   **Tác dụng:** Giúp bạn nhìn thấy một request từ lúc người dùng nhấn nút "Đặt hàng" trên Frontend đã đi qua Order Service rồi tới Inventory Service như thế nào, mất bao lâu ở mỗi bước.

---
**Tại sao cần hệ thống này?**
Trong môi trường Microservices, khi có lỗi xảy ra, bạn không thể đi vào từng container để xem log. Hệ thống này giúp bạn đứng từ trên cao (Grafana) để bao quát toàn bộ hệ thống và tìm ra "điểm nghẽn" chỉ trong vài cú click chuột.
