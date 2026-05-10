# Giải thích Kubernetes Kustomization

File `k8s/base/kustomization.yaml` đóng vai trò là "điểm hội tụ" và quản lý tất cả các tài nguyên Kubernetes trong dự án. Kustomize giúp bạn quản lý các cấu hình YAML mà không cần dùng template engine phức tạp.

## Các thành phần chính

### 1. `resources` (Danh sách tài nguyên)
Đây là phần quan trọng nhất, liệt kê tất cả các file YAML sẽ được áp dụng vào Cluster theo thứ tự:
*   **Cấu hình cơ bản:** `namespace.yaml`, `secrets.yaml`, `configmap.yaml`.
*   **Hạ tầng (Infrastructure):** Kafka, Prometheus, Grafana, Metrics Server...
*   **Dịch vụ ứng dụng (Services):** Order Service, Inventory Service, Frontend.
*   **Tự động hóa & Mạng:** HPA (tự động scale), Quotas (giới hạn tài nguyên), và Ingress (điều hướng mạng).

### 2. `configMapGenerator` (Bộ tạo ConfigMap)
Thay vì viết file ConfigMap thủ công với các đoạn text dài dằng dặc, Kustomize tự động đọc nội dung từ các file cấu hình thật trong thư mục `config/monitoring/` và đóng gói chúng thành một ConfigMap có tên `monitoring-configs`.
*   Việc này giúp tách biệt file cấu hình ứng dụng (như `prometheus.yml`) khỏi file định nghĩa Kubernetes, giúp dễ dàng chỉnh sửa và bảo trì.

### 3. `generatorOptions`
*   **`disableNameSuffixHash: true`**: Theo mặc định, Kustomize sẽ thêm một mã hash (ví dụ: `monitoring-configs-f8d2b`) vào đuôi tên ConfigMap mỗi khi nội dung thay đổi để ép các Pod phải khởi động lại. Ở đây, chúng ta tắt tính năng này để giữ tên cố định, phù hợp cho việc tham chiếu đơn giản trong các file Deployment.

## Tại sao sử dụng Kustomization?
*   **Tính module hóa:** Bạn có thể dễ dàng thêm hoặc bớt một dịch vụ chỉ bằng cách thêm/xóa một dòng trong danh sách `resources`.
*   **Quản lý cấu hình thông minh:** Tự động tạo ConfigMap từ file giúp tránh lỗi copy-paste dữ liệu cấu hình vào file YAML.
*   **Phân lớp (Layering):** Cho phép tạo ra các phiên bản khác nhau (dev, staging, prod) dựa trên một bộ khung (base) chung.
