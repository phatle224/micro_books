# Giải thích Hạn ngạch & Tính sẵn sàng (Quotas & PDB)

File `k8s/base/config/quotas.yaml` chứa các thiết lập để kiểm soát việc sử dụng tài nguyên và đảm bảo hệ thống không bị gián đoạn khi bảo trì.

## 1. ResourceQuota (Hạn ngạch tài nguyên)
Đây là "hàng rào" giới hạn tổng tài nguyên mà toàn bộ dự án `microbooks` được phép sử dụng trong Cluster:
*   **CPU**: Tổng yêu cầu tối thiểu là 4 cores và tối đa là 8 cores.
*   **RAM**: Tổng yêu cầu tối thiểu là 4GB và tối đa là 8GB.
*   **Pods**: Giới hạn tối đa 50 Pod được chạy cùng lúc.
*   **Tác dụng**: Ngăn chặn tình trạng một dự án bị lỗi (ví dụ: vòng lặp vô hạn tạo Pod) làm cạn kiệt tài nguyên của toàn bộ Cluster, gây ảnh hưởng đến các dự án khác.

## 2. PodDisruptionBudget (PDB)
PDB là một bản cam kết về tính sẵn sàng của ứng dụng:
*   **`minAvailable: 1`**: Thiết lập này thông báo cho Kubernetes rằng: "Dù bạn đang bảo trì hay nâng cấp Node, hãy luôn đảm bảo có ít nhất 1 Pod của dịch vụ này đang chạy".
*   **Áp dụng cho**: `frontend` và `order-service`.
*   **Tác dụng**: Đảm bảo khách hàng luôn có thể truy cập web và đặt hàng ngay cả khi hệ thống đang được cập nhật hoặc sửa chữa hạ tầng.

## Tóm tắt
*   **Quota**: Bảo vệ Cluster khỏi dự án.
*   **PDB**: Bảo vệ dự án khỏi các hoạt động bảo trì Cluster.
