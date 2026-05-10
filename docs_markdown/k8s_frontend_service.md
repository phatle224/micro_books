# Giải thích Kubernetes Deployment & Service - Frontend

File `k8s/base/services/frontend.yaml` chịu trách nhiệm triển khai giao diện người dùng (Next.js) lên cụm Kubernetes.

## 1. Deployment (Phần triển khai)

*   **`replicas: 1`**: Duy trì 1 bản sao của Pod frontend.
*   **`image: kietne1211/microbooks-frontend:latest`**: Sử dụng image đã build sẵn từ Docker Hub.
*   **Probes (Kiểm tra sức khỏe):**
    *   **`livenessProbe`**: Kiểm tra xem app có bị "treo" không. Nếu không phản hồi sau một số lần thử, K8s sẽ tự khởi động lại Pod.
    *   **`readinessProbe`**: Kiểm tra xem app đã sẵn sàng nhận traffic chưa (ví dụ: đã khởi động xong server Next.js chưa). Chỉ khi pass bước này, Ingress mới dẫn khách vào Pod.
*   **Resources (Tài nguyên):**
    *   **`limits`**: Giới hạn tối đa 0.5 CPU và 1.5GB RAM để tránh ứng dụng chiếm dụng toàn bộ tài nguyên của máy chủ.
    *   **`requests`**: Yêu cầu tối thiểu 0.1 CPU và 512MB RAM để có thể khởi chạy.
*   **Environment Variables (Biến môi trường):**
    *   Sử dụng `configMapKeyRef` để lấy các URL của `order-service` và `inventory-service` từ ConfigMap chung, giúp frontend biết đường để gọi API.

## 2. Service (Phần kết nối mạng)

*   **`kind: Service`**: Tạo một điểm truy cập cố định (IP nội bộ) cho các Pod frontend.
*   **`type: LoadBalancer`**: Cung cấp khả năng truy cập từ bên ngoài Cluster. Nếu chạy trên cloud, nó sẽ cấp một IP Public.
*   **`port: 3000`**: Cổng mà Service phơi ra.
*   **`targetPort: 3000`**: Cổng thực tế mà ứng dụng trong container đang lắng nghe.

## Tóm tắt luồng hoạt động
Frontend nhận URL của các backend qua biến môi trường -> Khởi động server trên cổng 3000 -> Kubernetes Service nhận yêu cầu từ Ingress và chuyển tiếp vào cổng 3000 của Pod.
