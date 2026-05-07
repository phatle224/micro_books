# Hướng dẫn Tạo Traffic Giả lập

Để kiểm tra hệ thống monitoring (Metrics, Tracing, Logs) có hoạt động hay không, bạn cần tạo ra các request gửi đến hệ thống. Dưới đây là các cách thực hiện.

## Cách 1: Sử dụng Script Python (Khuyên dùng)

Tôi đã tạo một script Python đơn giản để tự động gửi request liên tục.

**Chạy lệnh:**
```bash
python docs/generate_traffic.py
```

## Cách 2: Sử dụng lệnh cURL (Thủ công)

Bạn có thể copy các lệnh này vào Terminal (Bash hoặc PowerShell).

### 1. Kiểm tra Health Check (Tạo log đơn giản)
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

### 2. Lấy danh sách sách (Tạo Metrics & Traces)
```bash
curl http://localhost:3002/api/books/
```

### 3. Tìm kiếm sách (Tạo log có tham số)
```bash
curl "http://localhost:3002/api/books/?search=Clean+Code"
```

### 4. Lấy danh sách Order (Yêu cầu quyền Admin)
*Lưu ý: Bạn cần đăng nhập để có Token nếu muốn test sâu hơn, nhưng các request lỗi 401/403 cũng sẽ hiện lên Monitoring để bạn theo dõi lỗi.*
```bash
curl http://localhost:3001/api/orders/
```

## Cách 3: Sử dụng trình duyệt
Truy cập liên tục vào địa chỉ [http://localhost:3000](http://localhost:3000) và thực hiện các thao tác tìm kiếm sách trên giao diện.

---

## Sau khi tạo traffic, hãy kiểm tra tại:
1. **Grafana Log:** [http://localhost:3005/explore](http://localhost:3005/explore) (Chọn Loki)
2. **Kafka UI:** [http://localhost:8080](http://localhost:8080) (Xem các message được bắn ra khi có order mới)
