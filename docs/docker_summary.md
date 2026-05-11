# Tóm tắt Dockerfile và Docker Compose (Microbooks)

## 1) Tổng quan
Dự án dùng Docker để container hóa 3 dịch vụ chính (frontend, order_service, inventory_service) và Docker Compose để điều phối thêm các thành phần hạ tầng (Kafka, Zookeeper) cùng hệ thống quan sát (OpenTelemetry, Prometheus, Grafana, Loki, Tempo, Promtail).

## 2) Giải thích Dockerfile

### 2.1 Frontend (Next.js)
File: frontend/Dockerfile

- Dùng multi-stage build để giảm kích thước image.
- Stage 1 (builder):
  - Base: node:20-alpine.
  - Cài dependency từ package.json + package-lock.json.
  - Copy source, build bằng `npm run build`.
  - Nhận 2 biến ARG: ORDER_SERVICE_URL, INVENTORY_SERVICE_URL để build đúng endpoint.
- Stage 2 (runner):
  - Base: node:20-alpine.
  - Copy kết quả build (.next), public, node_modules.
  - Expose cổng 3000.
  - Chạy `npm run start` (mode production).

### 2.2 Order Service (FastAPI)
File: order_service/Dockerfile

- Base: python:3.11-slim.
- Cài dependency từ requirements.txt.
- Copy toàn bộ source vào /app.
- Expose cổng 3001.
- Chạy Uvicorn với `--reload` (phù hợp dev, hỗ trợ hot reload khi mount volume).

### 2.3 Inventory Service (FastAPI)
File: inventory_service/Dockerfile

- Tương tự order_service.
- Expose cổng 3002.
- Chạy Uvicorn với `--reload`.

### 2.4 (Tham khảo) Dockerfile tối ưu và chưa tối ưu
Thư mục docker_optimization có 2 Dockerfile minh họa tối ưu build cho Python.
- Dockerfile.unoptimized: ví dụ các lỗi thường gặp (copy sớm, cache kém, cài tool dư).
- Dockerfile.optimized: ví dụ tối ưu (multi-stage, cache tốt, user thường, image gọn).

## 3) Giải thích docker-compose.yml
File: docker-compose.yml

### 3.1 Các service chính
- zookeeper: điều phối Kafka.
- kafka: message broker (phụ thuộc zookeeper, có healthcheck).
- order_service:
  - Build từ order_service/Dockerfile.
  - Mở cổng 3001 (tùy biến qua ORDER_SERVICE_PORT).
  - Cần MONGO_URI, KAFKA_BROKER và các biến JWT.
  - Mount volume để hot reload trong dev.
- inventory_service:
  - Build từ inventory_service/Dockerfile.
  - Mở cổng 3002 (tùy biến qua INVENTORY_SERVICE_PORT).
  - Cần MONGO_URI, KAFKA_BROKER.
  - Mount volume để hot reload.
- frontend:
  - Build từ frontend/Dockerfile.
  - Mở cổng 3000 (tùy biến qua FRONTEND_PORT).
  - Nhận endpoint của các service backend.
  - Mount volume + node_modules/.next để dev.
- kafka-ui: giao diện theo dõi Kafka.

### 3.2 Quan sát hệ thống (Observability)
- otel-collector: thu thập traces/metrics từ service.
- prometheus: scrape metrics.
- grafana: dashboard (port 3005).
- loki: lưu logs.
- promtail: đẩy logs từ Docker.
- tempo: lưu traces.

### 3.3 Phụ thuộc và khởi động
- kafka phụ thuộc zookeeper.
- order_service và inventory_service chờ kafka healthy và otel-collector start.
- frontend phụ thuộc 2 backend service.
- grafana phụ thuộc prometheus, loki, tempo.

### 3.4 Volumes
- grafana_data, prometheus_data, tempo_data, loki_data: lưu dữ liệu bền vững.

## 4) Gợi ý cách dùng nhanh
- Chạy toàn bộ hệ thống: `docker-compose up -d`.
- Dừng: `docker-compose down`.
- Xem log: `docker-compose logs -f <service>`.

## 5) Lưu ý cấu hình
- Biến môi trường quan trọng: MONGO_URI, DOCKER_HUB_USERNAME, JWT_SECRET.
- Trên Windows, đã bật polling để phát hiện thay đổi file (`WATCHFILES_FORCE_POLLING`, `WATCHPACK_POLLING`, `CHOKIDAR_USEPOLLING`).
