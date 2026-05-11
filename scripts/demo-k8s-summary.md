# Demo K8s: Auto Scaling, Scale Down, Auto Healing

**Script:** `scripts/demo-k8s.ps1`  
**Namespace:** `microbooks` | **Service:** `order-service`

---

## Chuẩn bị

- Mở Grafana tại `http://localhost:3005/d/microbooks-dash`
- Script tự động dọn sạch tiến trình `yes` cũ từ lần chạy trước
- Reset deployment về **1 replica** trước khi bắt đầu

---

## Phần 1 — Auto Scaling

**Mục tiêu:** Chứng minh HPA tự tăng replica khi CPU cao

1. Chạy 3 tiến trình `yes > /dev/null` bên trong pod để đẩy CPU lên
2. Lưu PID vào `/tmp/ypids` để dọn sau
3. Poll HPA mỗi 10 giây (tối đa 2 phút) theo dõi `currentReplicas` và `averageUtilization`
4. Khi replicas > 1 → in thông báo và **dừng chờ người dùng xem Grafana**

**Kết quả mong đợi:** Panel `HPA Replicas` trên Grafana tăng vượt đường `min`

---

## Phần 2 — Auto Scale Down

**Mục tiêu:** Chứng minh HPA tự giảm replica khi CPU thấp trở lại

1. Kill các tiến trình `yes` bằng PID đã lưu (`/tmp/ypids`)
2. Kiểm tra CPU sau 5 giây — nếu vẫn > 50% (còn `yes` cũ) thì **force-delete toàn bộ pod** để làm sạch
3. Poll HPA mỗi 10 giây (tối đa 2.5 phút) chờ replicas về 1
4. Khi replicas ≤ 1 → **dừng chờ người dùng xem Grafana**

**Kết quả mong đợi:** Panel `HPA Replicas` giảm về đường `min` (~30–60 giây sau khi tắt tải)

---

## Phần 3 — Auto Healing

**Mục tiêu:** Chứng minh K8s tự tạo lại pod bị xóa

1. **Cordon node** để pod mới bị giữ ở trạng thái `Pending` (~15 giây) — đủ thời gian cho Prometheus scrape trạng thái `Running=0`
2. **Force-delete** toàn bộ pod đang chạy
3. Chờ 15 giây rồi **uncordon node** để K8s schedule pod mới
4. Poll trạng thái pod mỗi 3 giây (tối đa 60 giây) cho đến khi `Running`
5. Khi pod `Running` → in thời gian heal và **dừng chờ người dùng xem Grafana**

**Kết quả mong đợi:** Panel `Pod Status` trên Grafana: đường `Running` chớp về 0 rồi tăng lại trong vòng 15 giây

---

## Tổng kết

| Tính năng | Trigger | Kết quả |
|---|---|---|
| **Auto Scaling** | CPU cao (3x `yes`) | Replicas tăng tự động qua HPA |
| **Auto Scale Down** | CPU giảm (kill `yes`) | Replicas về 1 sau ~30–60s |
| **Auto Healing** | Pod bị xóa cưỡng bức | K8s tạo lại pod < 15 giây |

**Bằng chứng trực quan:** `http://localhost:3005/d/microbooks-dash`
