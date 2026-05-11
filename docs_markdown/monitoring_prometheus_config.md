# Giải thích Cấu hình Thu thập Metrics (Prometheus)

File `k8s/base/config/monitoring/prometheus.yml` quy định các "mục tiêu" (targets) mà Prometheus sẽ đi quét dữ liệu định kỳ.

## Các công việc thu thập (Scrape Jobs)

1.  **Hạ tầng giám sát**: Quét dữ liệu từ chính nó, từ OTel Collector, Loki và Tempo để đảm bảo hệ thống giám sát luôn hoạt động tốt.
2.  **`kube-state-metrics`**: Thu thập thông tin về trạng thái của các đối tượng trong Kubernetes (Pod nào đang chạy, Pod nào bị lỗi).
3.  **`kubernetes-cadvisor`**:
    *   Đây là phần cấu hình phức tạp nhất. Nó sử dụng quyền quản trị để "nhìn xuyên" qua Cluster, lấy thông số CPU/RAM thực tế của từng container từ các Node.
    *   Sử dụng giao thức HTTPS và Token bảo mật để truy cập.
4.  **`kubernetes-pods` (Tự động phát hiện)**:
    *   Đây là tính năng thông minh nhất. Prometheus sẽ tự động tìm tất cả các Pod trong namespace `microbooks`.
    *   Nó chỉ quét những Pod có gắn nhãn (annotation) `prometheus.io/scrape: "true"`.
    *   Việc này giúp bạn thêm một Microservice mới vào hệ thống mà không cần phải vào sửa file cấu hình Prometheus này.

## Thiết lập chung
*   **`scrape_interval: 10s`**: Cứ mỗi 10 giây, Prometheus sẽ đi lấy dữ liệu một lần. Điều này đảm bảo biểu đồ trên Grafana luôn cập nhật gần như tức thời với thực tế.
