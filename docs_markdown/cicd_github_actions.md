# Giải thích Quy trình CI/CD (GitHub Actions)

File `.github/workflows/ci-cd.yml` là bộ máy tự động hóa việc kiểm tra mã nguồn và đóng gói ứng dụng mỗi khi bạn đẩy code lên GitHub.

## Các giai đoạn chính (Jobs)

Quy trình được chia làm 2 giai đoạn lớn:

### 1. Giai đoạn Kiểm thử (kiem-thu)
Đây là giai đoạn quan trọng nhất để đảm bảo chất lượng code:
*   **Linting:** Kiểm tra định dạng code Python theo chuẩn PEP8. Nếu bạn viết code "cẩu thả", bước này sẽ báo lỗi ngay.
*   **Unit Tests:** Chạy các bài kiểm tra nhỏ cho từng hàm, từng logic xử lý trong `order_service` và `inventory_service`.
*   **Integration Test (Kiểm thử tích hợp):** 
    *   Tự động khởi chạy một môi trường giả lập với MongoDB và Kafka bằng Docker.
    *   Chạy thử cả hai Microservices và thực hiện một luồng đặt hàng thực tế để xem chúng có "nói chuyện" được với nhau không.
*   **Xử lý lỗi thông minh:** Nếu có bước nào thất bại, GitHub sẽ tự động tạo một **Issue** kèm theo log chi tiết để bạn biết chính xác cần sửa gì.

### 2. Giai đoạn Đóng gói (dong-goi-va-day-len-docker-hub)
Chỉ chạy khi giai đoạn kiểm thử thành công và code được đẩy vào nhánh `main`:
*   **Build Docker Image:** Tự động xây dựng các Docker image cho Frontend, Order Service và Inventory Service.
*   **Gắn thẻ (Tagging):** Mỗi bản build được gắn 2 thẻ: `latest` (bản mới nhất) và một thẻ ngắn dựa trên mã commit (SHA) để dễ dàng quay lại bản cũ nếu cần.
*   **Push:** Đẩy các image này lên Docker Hub của bạn.

## Lợi ích của quy trình này
*   **Phát hiện lỗi sớm:** Bạn biết ngay code của mình có làm hỏng hệ thống không chỉ sau vài phút push.
*   **Giải phóng sức người:** Bạn không cần phải build và push Docker thủ công từng service một.
*   **Tài liệu hóa lỗi:** Các Issue tự động giúp nhóm phát triển theo dõi lịch sử lỗi và cách khắc phục.
