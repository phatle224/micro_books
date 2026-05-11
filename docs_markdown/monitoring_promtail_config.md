# Giải thích Cấu hình Thu thập Log (Promtail)

File `k8s/base/config/monitoring/promtail-config.yml` định nghĩa cách Promtail đi tìm và xử lý các file log của container để đẩy về Loki.

## Các giai đoạn xử lý (Pipeline Stages)

Dòng log thô sẽ được "chế biến" qua các bước sau trước khi lưu vào kho:

1.  **`docker`**: Giải nén định dạng log mặc định của Docker (thường là JSON) để lấy ra nội dung log thực sự.
2.  **`regex` (Trích xuất thông tin)**:
    *   Sử dụng biểu thức chính quy (Regex) để đọc tên file log cực dài của Kubernetes.
    *   Từ đó, Promtail biết được dòng log này thuộc về **Namespace** nào, **Pod** nào và **Container** nào.
3.  **`labels`**: Gắn các thông tin vừa trích xuất được thành các "nhãn". Điều này cực kỳ quan trọng vì nó giúp bạn lọc log theo tên dịch vụ trên Grafana cực nhanh.
4.  **`level detection`**: Quét nội dung dòng log để tìm các từ khóa như `ERROR`, `WARN`, `INFO`. Sau đó gắn nhãn `level` để bạn có thể tạo biểu đồ thống kê số lượng lỗi trong hệ thống.

## Cơ chế chống mất dữ liệu
*   **`positions`**: Promtail lưu lại vị trí (dòng cuối cùng đã đọc) vào file `/tmp/positions.yaml`. Nếu Promtail bị khởi động lại, nó sẽ biết phải đọc tiếp từ đâu, đảm bảo không có dòng log nào bị bỏ sót hoặc bị đọc lặp lại.
