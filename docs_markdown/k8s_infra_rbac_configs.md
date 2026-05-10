# Giải thích Phân quyền (RBAC) cho Hệ thống Giám sát

Hệ thống Role-Based Access Control (RBAC) đảm bảo các công cụ giám sát có đủ quyền để "soi" vào các tài nguyên khác trong Cluster mà vẫn giữ được tính bảo mật.

## 1. Prometheus RBAC (`prometheus-rbac.yaml`)
*   **Tài khoản (`ServiceAccount`):** `prometheus`.
*   **Quyền hạn (`ClusterRole`):**
    *   Cho phép Prometheus đi "khám phá" (`list`, `watch`) các Service, Pod, Endpoint trên toàn bộ Cluster.
    *   Nếu không có quyền này, Prometheus sẽ không biết được Pod nào vừa mới được tạo ra để vào lấy dữ liệu metrics.
*   **Liên kết (`ClusterRoleBinding`):** Gắn các quyền trên vào tài khoản của Prometheus.

## 2. Promtail RBAC (`promtail-rbac.yaml`)
*   **Tài khoản:** `promtail`.
*   **Quyền hạn:**
    *   Cần quyền đọc thông tin về Pod và Node để biết file log của mỗi container đang nằm ở đâu trên ổ cứng máy chủ.
    *   Đặc biệt cần quyền truy cập qua `proxy` của Node để lấy dữ liệu log trực tiếp từ Kubernetes API nếu cần.

## Tại sao phải cấu hình RBAC?
Kubernetes mặc định rất bảo mật (Zero Trust). Một Pod bình thường sẽ không có quyền xem thông tin của các Pod khác. Để các công cụ như Prometheus và Promtail làm việc được, chúng ta phải cấp quyền "xem" (không cho phép sửa/xóa) một cách tường minh thông qua các file RBAC này.
