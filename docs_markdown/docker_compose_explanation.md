# Giải thích Docker Compose Configuration

File `docker-compose.yml` là "nhạc trưởng" điều phối toàn bộ hệ thống Microservices bao gồm: Message Broker, Backend, Frontend và hệ thống Giám sát (Monitoring).

## 1. Hệ thống Message Broker (Kafka)
*   **zookeeper**: Đóng vai trò quản lý metadata và điều phối các broker Kafka. Chạy trên cổng `2181`.
*   **kafka**: Hệ thống truyền tin nhắn giữa các microservice. Sử dụng Zookeeper để quản lý trạng thái. Có cơ chế `healthcheck` để đảm bảo nó đã sẵn sàng trước khi các dịch vụ khác kết nối tới.

## 2. Các Microservices Backend
*   **order_service**: 
    *   Xây dựng từ `./order_service`.
    *   Kết nối tới MongoDB và Kafka.
    *   Được tích hợp **OpenTelemetry (OTel)** để gửi dữ liệu giám sát về trạm thu thập.
    *   Sử dụng `volumes` để đồng bộ code (Hot-reload) khi phát triển.
*   **inventory_service**:
    *   Tương tự Order Service nhưng chạy trên cổng `3002`.
    *   Quản lý tồn kho và giao tiếp với Kafka.

## 3. Frontend & Tools
*   **frontend**: Ứng dụng Next.js chạy trên cổng `3000`. Kết nối tới cả hai backend service để lấy dữ liệu.
*   **kafka-ui**: Giao diện web (cổng `8080`) giúp người dùng theo dõi các topic, message và consumer trong Kafka một cách trực quan.

## 4. Hệ thống Giám sát (Monitoring Stack) - "Linh hồn" của quan sát viên
Hệ thống này được cấu hình cực kỳ đầy đủ để theo dõi sức khỏe ứng dụng:
*   **otel-collector**: Trạm thu thập dữ liệu tập trung. Nó nhận Trace, Log, Metrics từ các ứng dụng và phân phối về đúng nơi lưu trữ (Loki, Tempo, Prometheus).
*   **prometheus**: Lưu trữ các chỉ số (Metrics) như CPU, RAM, số lượng request.
*   **loki**: Lưu trữ Logs tập trung từ tất cả các container.
*   **promtail**: Agent quét log từ Docker socket và đẩy về Loki.
*   **tempo**: Lưu trữ các vết (Tracing), giúp theo dõi một request đi qua những service nào.
*   **grafana**: Giao diện Dashboard (cổng `3005`) tổng hợp tất cả dữ liệu từ Prometheus, Loki, Tempo để hiển thị biểu đồ.

## 5. Cấu hình Volumes
Các volume như `grafana_data`, `prometheus_data`, `loki_data`, `tempo_data` giúp dữ liệu giám sát không bị mất đi khi chúng ta tắt hoặc khởi động lại container.

---
**Lưu ý:** File này sử dụng nhiều biến môi trường (ví dụ: `${MONGO_URI}`) được định nghĩa trong file `.env` để đảm bảo tính bảo mật và linh hoạt.
