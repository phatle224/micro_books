# Giải thích Tự động mở rộng (Horizontal Pod Autoscaler - HPA)

File `k8s/base/config/hpa.yaml` định nghĩa cơ chế "tự co giãn" cho các dịch vụ dựa trên tải thực tế của hệ thống.

## Nguyên lý hoạt động
HPA theo dõi mức độ sử dụng CPU của các Pod. Nếu CPU vượt quá ngưỡng cho phép, HPA sẽ ra lệnh cho Deployment tạo thêm các bản sao (Pod) mới để chia sẻ tải. Khi tải giảm xuống, nó sẽ tự động xóa bớt Pod để tiết kiệm tài nguyên.

## Cấu hình chi tiết cho các Service

### 1. Frontend
*   **Số lượng Pod**: Từ 1 đến 5 bản sao.
*   **Ngưỡng kích hoạt**: Khi CPU trung bình vượt quá **70%**.
*   **Hành vi (`behavior`)**:
    *   **Scale Up**: Tăng ngay lập tức (0s) tối đa 4 Pod mỗi 15 giây.
    *   **Scale Down**: Đợi 30 giây tải thấp ổn định mới bắt đầu giảm Pod để tránh tình trạng "vừa tăng xong lại giảm" liên tục.

### 2. Order & Inventory Service
*   **Số lượng Pod**: Từ 1 đến 3 bản sao.
*   **Ngưỡng kích hoạt**: Khi CPU trung bình vượt quá **80%**.
*   **Hành vi**: Tăng/giảm tối đa 2 Pod mỗi 15 giây.

## Lợi ích của HPA
*   **Tiết kiệm chi phí**: Chỉ dùng nhiều tài nguyên khi thực sự cần thiết.
*   **Tính ổn định**: Hệ thống tự động ứng phó với các đợt truy cập tăng đột biến mà không cần sự can thiệp của con người.
*   **Trải nghiệm người dùng**: Đảm bảo ứng dụng không bị chậm khi có đông người dùng.
