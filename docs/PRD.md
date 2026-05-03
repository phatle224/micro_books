Đóng vai trò là một Senior Full-stack và DevOps Engineer. Hãy thiết kế cấu trúc thư mục, viết cấu hình Docker và code boilerplate cho một Hệ thống Thương mại điện tử Bán sách (E-commerce Bookstore) áp dụng kiến trúc Microservices. Hệ thống này phải bao gồm 2 phần giao diện: Trang mua hàng cho khách (Storefront) và Trang quản trị (Admin Dashboard).

1. Công nghệ sử dụng (Tech Stack):

Frontend: Next.js (Sử dụng App Router, chia layout rõ ràng cho / storefront và /admin dashboard).

Backend Services: Python/FastAPI (hiệu năng cao, dễ viết tài liệu API tự động với Swagger).

Database: MongoDB Atlas.

Message Broker: Apache Kafka (để giao tiếp bất đồng bộ giữa các services).

Hạ tầng: Docker & Docker Compose.

2. Kiến trúc Microservices (Gồm 2 services cốt lõi):

Order Service:

Phục vụ cho Storefront: Nhận request đặt hàng từ khách, lưu đơn hàng (trạng thái 'pending') vào MongoDB và publish event order_created lên Kafka topic.

Phục vụ cho Admin: Cung cấp API để Admin xem danh sách đơn hàng và cập nhật trạng thái đơn.

Inventory Service:

Xử lý bất đồng bộ: Subscribe vào Kafka topic từ Order Service. Khi nhận được event order_created, nó sẽ tự động trừ số lượng sách tồn kho trong MongoDB và xác nhận thành công.

Phục vụ cho Admin: Cung cấp các RESTful API chuẩn để Admin có thể thêm sách mới, sửa thông tin sách, và cập nhật số lượng tồn kho.

3. Yêu cầu kỹ thuật (Technical Requirements):

Bảo mật: Tuyệt đối không hardcode credentials. Yêu cầu sử dụng file .env cho chuỗi kết nối database và các config khác (ví dụ: MONGO_URI=mongodb+srv://<user>:<password>@cnlthd.ijxnmqz.mongodb.net/?appName=CNLTHD).

Dockerization: Viết Dockerfile riêng biệt cho Frontend, Order Service và Inventory Service.

Docker Compose & Hot-reload: Viết file docker-compose.yml để khởi chạy toàn bộ hệ thống (gồm cả Kafka và Zookeeper/KRaft local). Yêu cầu bắt buộc: Phải cấu hình volumes map code từ máy host vào container và dùng command chuẩn xác (ví dụ: uvicorn ... --reload) để hỗ trợ tính năng Hot-reload cho môi trường dev.

4. Kết quả mong đợi (Output):

Sơ đồ cấu trúc thư mục (Folder structure) của toàn bộ monorepo, thể hiện rõ việc phân tách Frontend (Storefront & Admin) và các Backend services.

Mã nguồn file docker-compose.yml và các file Dockerfile (phiên bản dev hỗ trợ hot-reload).

Đoạn code boilerplate cơ bản bằng FastAPI cho:

Order Service: API tạo đơn hàng và logic publish event Kafka.

Inventory Service: Logic consume event Kafka để trừ kho, và 1 API mẫu cho Admin thêm sách vào kho.