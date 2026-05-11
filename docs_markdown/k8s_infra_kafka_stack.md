# Giải thích Hệ thống Message Broker (Kafka & Kafka UI)

Hệ thống này chịu trách nhiệm truyền tải tin nhắn giữa các Microservices một cách bất đồng bộ, đảm bảo tính ổn định và khả năng mở rộng.

## 1. Zookeeper (`kafka.yaml`)
*   **Vai trò:** Là "người điều phối" cho Kafka. Nó quản lý danh sách các Broker, các Topic và trạng thái của cụm Kafka.
*   **Cổng:** `2181`.
*   **Đặc điểm:** Kafka không thể chạy nếu thiếu Zookeeper (trong phiên bản hiện tại của dự án).

## 2. Kafka Broker (`kafka.yaml`)
*   **Vai trò:** Trung tâm lưu trữ và phân phối tin nhắn.
*   **Cổng:** `9092`.
*   **Cấu hình quan trọng:**
    *   `KAFKA_ADVERTISED_LISTENERS`: Địa chỉ mà các ứng dụng khác (`order-service`, `inventory-service`) sẽ sử dụng để kết nối tới.
    *   `strategy: Recreate`: Đảm bảo không có hai pod Kafka chạy cùng lúc tranh chấp dữ liệu khi cập nhật.
    *   `KAFKA_AUTO_CREATE_TOPICS_ENABLE`: Cho phép tự động tạo topic khi có ứng dụng gửi tin nhắn tới lần đầu.

## 3. Kafka UI (`kafka-ui.yaml`)
*   **Vai trò:** Cung cấp giao diện web để quản trị viên theo dõi hệ thống Kafka.
*   **Cổng truy cập:** `8080`.
*   **Chức năng:** Xem danh sách các Broker, xem nội dung tin nhắn trong các Topic, theo dõi các Consumer Group xem có bị chậm trễ (lag) hay không.
*   **Loại Service:** `LoadBalancer` giúp bạn truy cập trực tiếp từ trình duyệt.

## Luồng hoạt động
Ứng dụng gửi tin nhắn -> Kafka Broker lưu trữ -> Kafka UI hiển thị trạng thái -> Ứng dụng khác nhận tin nhắn.
