# Giải thích Hệ thống Metrics (Metrics Server & Kube-State-Metrics)

Hệ thống này cung cấp các con số về "sức khỏe" của toàn bộ cụm Kubernetes, phục vụ cho việc tự động mở rộng và giám sát.

## 1. Metrics Server (`metrics-server.yaml`)
*   **Vai trò:** Thu thập các thông số tài nguyên thô (CPU, RAM) từ các Node và Pod.
*   **Tác dụng chính:** Cung cấp dữ liệu cho lệnh `kubectl top` và quan trọng nhất là cho **Horizontal Pod Autoscaler (HPA)** để tự động tăng/giảm số lượng Pod.
*   **Lưu ý kỹ thuật:** Chạy trong namespace `kube-system` vì đây là một thành phần lõi của Kubernetes. Nó sử dụng tham số `--kubelet-insecure-tls` để có thể chạy được trong các môi trường lab/dev mà không cần cấu hình chứng chỉ bảo mật phức tạp.

## 2. Kube-State-Metrics (`kube-state-metrics.yaml`)
*   **Vai trò:** Không đo CPU/RAM, mà thay vào đó nó "đếm" trạng thái của các đối tượng trong K8s.
*   **Tác dụng chính:** Trả lời các câu hỏi như: Có bao nhiêu Pod đang chạy? Có bao nhiêu Deployment đang bị lỗi? Bản sao (replicas) hiện tại là bao nhiêu?
*   **Phân quyền (RBAC):** Nó cần một `ClusterRole` rất mạnh để có thể "nhìn" thấy tất cả các tài nguyên trong toàn bộ Cluster.

## Sự khác biệt quan trọng
*   **Metrics Server:** Cho biết Pod đang dùng **bao nhiêu** tài nguyên (CPU/RAM).
*   **Kube-State-Metrics:** Cho biết Pod đang ở **trạng thái nào** (Running, Pending, Failed).
=> Cả hai phối hợp để Dashboard Grafana có thể hiển thị đầy đủ cả biểu đồ hiệu năng lẫn biểu đồ trạng thái hệ thống.
