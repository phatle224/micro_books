Đóng vai trò là một Senior Full-stack và DevOps Engineer. Hãy thiết kế cấu trúc thư mục, viết cấu hình Docker và code boilerplate cho một Hệ thống Quản lý Bán sách (Bookstore Management System) áp dụng kiến trúc Microservices.

1. Công nghệ sử dụng (Tech Stack):

Frontend: Next.js

Backend Services: [Điền framework backend bạn muốn, ví dụ: Node.js/Express, Python/FastAPI, Go...]

Database: MongoDB Atlas

Message Broker: Apache Kafka (để giao tiếp bất đồng bộ giữa các services)

Hạ tầng: Docker & Docker Compose

2. Kiến trúc Microservices (Gồm 2 services cốt lõi):

Order Service: Chịu trách nhiệm tạo và quản lý đơn hàng. Khi một đơn hàng được tạo, service này sẽ lưu vào MongoDB và publish một event (ví dụ: order_created) lên Kafka topic.

Inventory Service: Quản lý kho sách. Subscribe vào Kafka topic từ Order Service. Khi nhận được event có đơn hàng mới, nó sẽ tự động trừ số lượng sách tồn kho trong MongoDB.

3. Yêu cầu kỹ thuật (Technical Requirements):

Bảo mật: Không hardcode credentials. Sử dụng file .env cho chuỗi kết nối database (ví dụ: MONGO_URI=mongodb+srv://<user>:<password>@cnlthd.ijxnmqz.mongodb.net/?appName=CNLTHD).

Dockerization: Viết Dockerfile riêng biệt cho Frontend, Order Service và Inventory Service.

Docker Compose & Hot-reload: Viết file docker-compose.yml để khởi chạy toàn bộ hệ thống (gồm cả Kafka broker local nếu cần). Yêu cầu bắt buộc: Phải cấu hình volumes và command chuẩn xác để hỗ trợ tính năng Hot-reload (khi chỉnh sửa code ở máy host, container tự động cập nhật code mới mà không cần rebuild).

4. Kết quả mong đợi (Output):

Sơ đồ cấu trúc thư mục (Folder structure) của toàn bộ monorepo/dự án.

Mã nguồn file docker-compose.yml và các file Dockerfile (cho dev environment với hot-reload).

Đoạn code boilerplate cơ bản của Order Service (tạo đơn, gửi event Kafka) và Inventory Service (nhận event Kafka, xử lý kho). 


Database dùng mongodb  atlas 
mongodb+srv://truongquockiet1211_db_user:1234567890@cnlthd.ijxnmqz.mongodb.net/?appName=CNLTHD