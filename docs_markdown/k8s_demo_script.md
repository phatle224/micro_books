# Giải thích Kịch bản Demo Kubernetes (demo-k8s.ps1)

File `scripts/demo-k8s.ps1` là một script PowerShell tự động hóa việc trình diễn các tính năng quan trọng nhất của Kubernetes: **Auto Scaling**, **Scale Down**, và **Auto Healing**.

## Các chức năng chính

Script được chia làm 3 phần chính, tương ứng với các tính năng cốt lõi của K8s:

### Phần 1: Auto Scaling (Tự động mở rộng)
*   **Cơ chế:** Script sử dụng lệnh `kubectl exec` để chạy các tiến trình `yes > /dev/null` bên trong pod. Việc này sẽ đẩy mức sử dụng CPU lên gần 100%.
*   **Kết quả:** Kubernetes Horizontal Pod Autoscaler (HPA) sẽ phát hiện CPU vượt ngưỡng cấu hình và tự động tăng số lượng bản sao (replicas) của `order-service` để chia tải.
*   **Theo dõi:** Bạn sẽ thấy số lượng pod tăng lên trên Grafana tại panel "HPA Replicas".

### Phần 2: Auto Scale Down (Tự động thu nhỏ)
*   **Cơ chế:** Script tìm và xóa (kill) các tiến trình `yes` đã tạo ở bước trước.
*   **Kết quả:** Mức sử dụng CPU giảm xuống mức thấp. HPA sẽ chờ một khoảng thời gian (cooldown) và sau đó giảm số lượng replicas về mức tối thiểu (thường là 1) để tiết kiệm tài nguyên.
*   **Theo dõi:** Panel "HPA Replicas" sẽ cho thấy đường biểu đồ giảm về mức 1.

### Phần 3: Auto Healing (Tự phục hồi)
*   **Cơ chế:**
    1.  **Cordon Node:** Script tạm thời đánh dấu node là "không cho phép chạy pod mới" (`cordon`).
    2.  **Xóa Pod:** Script xóa các pod đang chạy của service.
    3.  **Uncordon:** Sau một vài giây, script mở lại node.
*   **Kết quả:** Kubernetes phát hiện số lượng pod thực tế (0) đang thấp hơn số lượng mong muốn (1). Nó sẽ tự động tạo lại pod mới ngay khi node sẵn sàng.
*   **Theo dõi:** Panel "Pod Status" trên Grafana sẽ cho thấy trạng thái `Running` biến mất trong chốc lát và sau đó xuất hiện trở lại.

## Các hàm hỗ trợ trong Script
*   `DocReplicas` & `DocCPU`: Truy vấn trực tiếp từ HPA của Kubernetes để lấy thông số thời gian thực.
*   `DungLai`: Tạm dừng script và nhắc người dùng nhìn vào dashboard Grafana để đối chiếu dữ liệu thực tế.
*   `GhiLog`: Hiển thị thông báo tiến trình với màu sắc dễ nhìn.

## Cách chạy Demo
1. Đảm bảo Cluster K8s đang chạy (Minikube hoặc Docker Desktop).
2. Mở Grafana tại: `http://localhost:3005/d/microbooks-dash`.
3. Mở terminal tại thư mục gốc của dự án.
4. Chạy lệnh: `.\scripts\demo-k8s.ps1`.

---
**Lưu ý:** Script này được thiết kế để phối hợp chặt chẽ với Dashboard Grafana có sẵn trong dự án nhằm mang lại cái nhìn trực quan nhất về cách Kubernetes vận hành.
