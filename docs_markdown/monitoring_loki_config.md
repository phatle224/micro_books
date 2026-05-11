# Giải thích Cấu hình Lưu trữ Logs (Loki)

File `k8s/base/config/monitoring/loki-config.yml` quy định cách Loki nhận, lưu trữ và dọn dẹp các bản ghi log trong hệ thống.

## Các thành phần cấu hình chính

1.  **`server`**: Loki lắng nghe các yêu cầu đẩy log và truy vấn tại cổng **3100**.
2.  **`storage` (Hệ thống tệp)**:
    *   Dữ liệu được lưu trữ trực tiếp vào ổ cứng tại `/loki/chunks`. Dự án không sử dụng các dịch vụ lưu trữ đám mây (như S3) để đơn giản hóa việc triển khai cục bộ.
3.  **`schema_config` (Lược đồ dữ liệu)**:
    *   Sử dụng định dạng **TSDB** (Time Series Database) cho chỉ mục, giúp việc tìm kiếm hàng triệu dòng log diễn ra cực kỳ nhanh chóng.
4.  **`retention_period: 168h`**:
    *   Quy định thời gian lưu trữ log là **7 ngày**. Sau thời gian này, các log cũ sẽ tự động được xóa bỏ để giải phóng bộ nhớ.
5.  **`compactor`**:
    *   Bộ phận chịu trách nhiệm nén dữ liệu và thực hiện việc xóa log cũ theo đúng chính sách `retention` đã đề ra.

## Vai trò trong dự án
Loki đóng vai trò là "kho chứa log tập trung". Thay vì phải dùng lệnh `kubectl logs` cho từng Pod, bạn chỉ cần lên Grafana và truy vấn mọi thứ từ Loki một cách dễ dàng và nhanh chóng.
