
## 0. Giải thích các khái niệm cơ bản

Trước khi sử dụng các lệnh bên dưới, bạn cần nắm vững các định danh cốt lõi để tránh nhầm lẫn giữa Docker (Local) và Kubernetes (Cluster):

| Khái niệm | Ví dụ | Ý nghĩa | Cách lấy (Lệnh) |
| :--- | :--- | :--- | :--- |
| **Image** | `order-service:latest` | Bản đóng gói (blueprint) chứa mã nguồn và môi trường chạy. | `docker images` |
| **Service Name** | `order-service` | Tên định danh ổn định (DNS) để các dịch vụ gọi nhau. | `kubectl get svc -n micro-books` |
| **Pod Name** | `order-service-7f...` | Một instance (tiến trình) đang chạy của ứng dụng trên K8s. | `kubectl get pods -n micro-books` |
| **Container ID** | `e123abc456...` | Mã định danh cấp thấp do Docker/Containerd quản lý. | `docker compose ps` |
| **Namespace** | `micro-books` | "Phòng ảo" dùng để phân tách tài nguyên trong Cluster. | `kubectl get ns` |

---

## 1. Docker & Docker Compose (Môi trường Phát triển)

Sử dụng Docker Compose để chạy toàn bộ stack dịch vụ ở môi trường local một cách nhanh chóng.

### Quản lý Stack
| Lệnh | Mô tả |
| :--- | :--- |
| `docker compose up -d` | Khởi chạy toàn bộ hệ thống ở chế độ chạy ngầm (detached). |
| `docker compose up -d --build` | Build lại các image và khởi chạy (dùng khi mới sửa code). |
| `docker compose down` | Dừng và xóa toàn bộ container, network được tạo bởi compose. |
| `docker compose ps` | Kiểm tra trạng thái các service đang chạy. |

### Xem Logs & Debug
| Lệnh | Mô tả |
| :--- | :--- |
| `docker compose logs -f` | Xem log của tất cả các service theo thời gian thực. |
| `docker compose logs -f <service-name>` | Xem log của một service cụ thể (vd: `order-service`). |
| `docker exec -it <container-id> sh` | Truy cập terminal bên trong container. |

---

## 2. Kubernetes (Môi trường Triển khai)

Dự án sử dụng **Kustomize** để quản lý cấu hình. Các lệnh dưới đây giả định bạn đang ở thư mục gốc của dự án.

### Triển khai & Cập nhật
| Lệnh | Mô tả |
| :--- | :--- |
| `kubectl apply -k k8s/base` | Triển khai toàn bộ hạ tầng và dịch vụ bằng Kustomize. |
| `kubectl delete -k k8s/base` | Xóa toàn bộ tài nguyên đã triển khai. |
| `kubectl rollout restart deployment/<name>` | Khởi động lại một deployment (để nhận cấu hình mới). |

### Kiểm tra tài nguyên
| Lệnh | Mô tả |
| :--- | :--- |
| `kubectl get pods -n micro-books` | Xem danh sách các Pod trong namespace `micro-books`. |
| `kubectl get svc -n micro-books` | Xem danh sách các Service và địa chỉ IP nội bộ. |
| `kubectl get ing -n micro-books` | Kiểm tra cấu hình Ingress (địa chỉ truy cập từ bên ngoài). |
| `kubectl describe pod <pod-name> -n micro-books` | Xem chi tiết lỗi nếu Pod không chạy được. |

### Debug & Giám sát
| Lệnh | Mô tả |
| :--- | :--- |
| `kubectl logs -f <pod-name> -n micro-books` | Theo dõi log của một Pod cụ thể. |
| `kubectl exec -it <pod-name> -n micro-books -- sh` | Truy cập vào bên trong Pod trên Cluster. |
| `kubectl top pod -n micro-books` | Kiểm tra lượng CPU/RAM các Pod đang sử dụng. |

---

## 3. Port-Forwarding (Truy cập công cụ nội bộ)

Sử dụng `port-forward` để truy cập các dịch vụ giám sát hoặc hạ tầng mà không cần public chúng ra Internet.

| Dịch vụ | Lệnh Forward | Địa chỉ truy cập |
| :--- | :--- | :--- |
| **Grafana** | `kubectl port-forward svc/grafana 3000:3000 -n micro-books` | [localhost:3000](http://localhost:3000) |
| **Kafka UI** | `kubectl port-forward svc/kafka-ui 8080:8080 -n micro-books` | [localhost:8080](http://localhost:8080) |
| **Prometheus** | `kubectl port-forward svc/prometheus-server 9090:80 -n micro-books` | [localhost:9090](http://localhost:9090) |

---

## 4. Các lệnh Hạ tầng (Infrastructure) chuyên sâu

Vì dự án sử dụng Kafka và MongoDB, bạn sẽ cần các lệnh này để kiểm tra dữ liệu trực tiếp.

### Apache Kafka (Truy vết Message)
| Lệnh | Mô tả |
| :--- | :--- |
| `kubectl exec -it kafka-0 -n micro-books -- kafka-topics.sh --list --bootstrap-server localhost:9092` | Liệt kê tất cả các Topic hiện có. |
| `kubectl exec -it kafka-0 -n micro-books -- kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic order-events --from-beginning` | Xem toàn bộ message trong topic `order-events`. |
| `kubectl exec -it kafka-0 -n micro-books -- kafka-topics.sh --describe --topic order-events --bootstrap-server localhost:9092` | Xem chi tiết phân mảnh (partitions) và bản sao (replicas). |

### MongoDB (Kiểm tra dữ liệu DB)
| Lệnh | Mô tả |
| :--- | :--- |
| `kubectl exec -it mongodb-0 -n micro-books -- mongosh` | Truy cập vào shell của MongoDB. |
| `db.orders.find().limit(5)` | (Trong mongosh) Xem 5 đơn hàng mới nhất. |
| `db.users.countDocuments()` | (Trong mongosh) Đếm số lượng người dùng. |

---

## 5. Giám sát & Observability (Loki/Prometheus)

Dành cho việc truy vấn log và số liệu trên Grafana Dashboard.

### LogQL (Truy vấn log trong Grafana Loki)
*   **Xem log của service cụ thể:** `{app="order-service"}`
*   **Tìm kiếm lỗi:** `{app="inventory-service"} |= "error"`
*   **Loại bỏ các log không cần thiết:** `{app="frontend"} != "GET /health"`

### Quản lý cấu hình (Secrets & ConfigMaps)
| Lệnh | Mô tả |
| :--- | :--- |
| `kubectl get configmap -n micro-books` | Xem các file cấu hình đang được sử dụng. |
| `kubectl get secret -n micro-books` | Xem danh sách các secret (mật khẩu, token). |
| `kubectl edit configmap micro-books-config -n micro-books` | Sửa trực tiếp cấu hình (cần restart pod sau khi sửa). |

---

## 6. Các lệnh hữu ích khác

### Kiểm tra hiệu năng Cluster
```bash
# Xem Pod nào đang chiếm dụng tài nguyên nhiều nhất
kubectl top pods -n micro-books --sort-by=cpu
```

### Dọn dẹp hệ thống Docker
```bash
# Xóa các image, container, network không sử dụng để giải phóng dung lượng
docker system prune -f
```

### Kiểm tra cấu hình Kustomize trước khi Apply
```bash
# Xem nội dung YAML cuối cùng sẽ được gửi lên Cluster
kubectl kustomize k8s/base
```

---
> **Lưu ý:** Luôn đảm bảo bạn đã chọn đúng Context của Kubernetes (`kubectl config current-context`) trước khi thực hiện các lệnh `apply` hoặc `delete`.
