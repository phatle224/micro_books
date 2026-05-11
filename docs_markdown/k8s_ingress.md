# Giải thích Kubernetes Ingress

File `k8s/base/ingress.yaml` đóng vai trò là "Cổng chào" (Gateway) cho toàn bộ hệ thống, điều phối lưu lượng truy cập từ Internet vào các dịch vụ bên trong Cluster.

## Chi tiết các thành phần

1.  **`kind: Ingress`**
    *   Xác định đây là tài nguyên định tuyến mạng lớp 7 (HTTP/HTTPS).

2.  **`annotations`**
    *   **`nginx.ingress.kubernetes.io/rewrite-target: /`**: Chỉ thị cho Nginx Ingress Controller rằng sau khi khớp đường dẫn, hãy gửi yêu cầu tới dịch vụ phía sau với đường dẫn gốc `/`. Việc này giúp frontend nhận được request đúng định dạng.

3.  **`spec.rules` (Quy tắc định tuyến)**
    *   **`host: microbooks.local`**: Đây là tên miền ảo. Thay vì dùng IP phức tạp, bạn có thể truy cập ứng dụng qua địa chỉ `http://microbooks.local` (cần cấu hình file `hosts` trên máy tính cá nhân để trỏ tên miền này về IP của Cluster).
    *   **`http.paths`**:
        *   **`path: /`**: Áp dụng quy tắc cho mọi yêu cầu bắt đầu bằng dấu gạch chéo (tức là toàn bộ ứng dụng).
        *   **`pathType: Prefix`**: Kiểu khớp tiền tố.
        *   **`backend`**: Chỉ định rằng toàn bộ traffic này sẽ được chuyển hướng tới service có tên **`frontend`** đang chạy tại cổng **`3000`**.

## Luồng đi của một Request
1. Người dùng truy cập `http://microbooks.local` từ trình duyệt.
2. Request đi đến Ingress Controller (thường là Nginx).
3. Ingress Controller dựa vào file cấu hình này để biết rằng cần gửi request đó vào bên trong Cluster cho service `frontend`.
4. Service `frontend` nhận yêu cầu và trả về giao diện trang web cho người dùng.

## Lợi ích
*   **Quản lý tập trung:** Chỉ cần một địa chỉ IP duy nhất cho toàn bộ hệ thống gồm nhiều microservice.
*   **Tên miền thân thiện:** Sử dụng tên miền thay vì địa chỉ IP và số cổng.
*   **Bảo mật:** Có thể dễ dàng cấu hình SSL/TLS (HTTPS) tập trung tại Ingress thay vì cấu hình trên từng microservice.
