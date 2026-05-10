# Giải thích Quy trình Triển khai Local (Local Deployment)

File `.github/workflows/local-deploy.yml` chịu trách nhiệm tự động cập nhật ứng dụng đang chạy ngay trên máy tính cá nhân (hoặc server nội bộ) của bạn.

## Cơ chế hoạt động

*   **Kích hoạt tự động:** Quy trình này sẽ tự chạy ngay sau khi quy trình **CI/CD cho Microbooks** hoàn thành thành công trên nhánh `main`.
*   **Runner:** Sử dụng `self-hosted` runner. Điều này có nghĩa là lệnh sẽ được thực thi trực tiếp bởi máy tính của bạn (đã được cài đặt GitHub Runner) chứ không phải máy ảo của GitHub.

## Các bước thực hiện chính

1.  **Khôi phục file `.env`**: Vì file `.env` chứa thông tin bảo mật không được đưa lên GitHub, script sẽ tự động copy file `.env` từ một thư mục cố định trên máy bạn vào thư mục dự án vừa tải về.
2.  **Đăng nhập Docker Hub**: Để có quyền tải về các image vừa được build từ quy trình CI trước đó.
3.  **Lựa chọn mục tiêu triển khai (`DEPLOY_TARGET`)**:
    *   Nếu chọn `docker`: Sử dụng `docker-compose pull` và `up -d` để cập nhật container.
    *   Nếu chọn `k8s` (Mặc định): Sử dụng `kubectl apply -k` để cập nhật Kubernetes Cluster.
4.  **Làm mới ứng dụng (`Rollout Restart`)**: Thực hiện lệnh restart các deployment trong Kubernetes để đảm bảo các Pod mới sẽ sử dụng image mới nhất vừa được tải về.

## Tại sao cần file này?
*   **Đồng bộ hóa tức thì:** Ngay khi code được duyệt trên GitHub, ứng dụng trên máy bạn cũng được cập nhật theo mà không cần bạn phải gõ lệnh thủ công.
*   **Kiểm tra thực tế:** Giúp bạn kiểm tra xem code chạy tốt trên môi trường GitHub Actions có thực sự chạy tốt trên hạ tầng local (Docker/K8s) của mình hay không.
