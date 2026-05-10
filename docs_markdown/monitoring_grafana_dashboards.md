# Giải thích Cấu hình Dashboard Grafana

File `k8s/base/config/monitoring/dashboards.yml` định nghĩa cách Grafana tự động nạp (provision) các bảng điều khiển (Dashboards) từ mã nguồn vào giao diện web.

## Các thiết lập quan trọng

1.  **`providers`**: Khai báo nhà cung cấp Dashboard. Dự án sử dụng nhà cung cấp có tên `microbooks`.
2.  **`folder: MicroBooks`**: Tất cả các biểu đồ sẽ được gom nhóm vào một thư mục tên là **MicroBooks** trên giao diện Grafana, giúp bạn dễ dàng tìm kiếm.
3.  **`type: file`**: Chỉ định rằng các Dashboard được định nghĩa trong các file JSON (ví dụ: `microservices-dashboard.json`).
4.  **`path: /var/lib/grafana/dashboards`**: Đây là đường dẫn bên trong container nơi Grafana sẽ quét để tìm các file JSON.
5.  **`disableDeletion: true`**: Ngăn chặn việc vô tình xóa Dashboard quan trọng từ giao diện web.
6.  **`allowUiUpdates: true`**: Cho phép bạn chỉnh sửa biểu đồ trực tiếp trên giao diện để thử nghiệm. Tuy nhiên, nếu bạn muốn lưu vĩnh viễn, bạn phải cập nhật lại file JSON trong mã nguồn.

## Lợi ích
Cấu hình này giúp Dashboard luôn sẵn sàng ngay khi hệ thống vừa khởi động, đảm bảo tính nhất quán giữa môi trường phát triển và môi trường chạy thực tế (Production).
