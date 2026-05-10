# Giải thích Kubernetes Namespace

File `k8s/base/namespace.yaml` định nghĩa không gian làm việc (Namespace) cho toàn bộ dự án trong cụm Kubernetes.

## Chi tiết các thành phần

1.  **`apiVersion: v1`**
    *   Sử dụng phiên bản API v1, đây là phiên bản ổn định cho các tài nguyên cơ bản của Kubernetes.

2.  **`kind: Namespace`**
    *   Xác định loại tài nguyên là một **Namespace**.
    *   **Tác dụng:** Giúp phân chia tài nguyên trong cùng một Cluster vật lý thành các nhóm logic khác nhau. Việc này ngăn chặn xung đột tên gọi (ví dụ: hai service có cùng tên ở hai namespace khác nhau) và giúp quản lý quyền truy cập dễ dàng hơn.

3.  **`metadata.name: microbooks`**
    *   Đặt tên cho Namespace là `microbooks`. Tất cả các tài nguyên khác của dự án (Pod, Service, ConfigMap...) sẽ được triển khai bên trong không gian tên này.

## Lợi ích của việc dùng Namespace
*   **Quản lý tập trung:** Bạn có thể xóa toàn bộ dự án chỉ bằng một lệnh xóa namespace.
*   **Cách ly tài nguyên:** Đảm bảo các ứng dụng của dự án `microbooks` không can thiệp vào các ứng dụng khác đang chạy trên cùng Cluster.
*   **Giới hạn tài nguyên (Quotas):** Cho phép thiết lập mức trần CPU/RAM mà dự án `microbooks` được phép sử dụng.
