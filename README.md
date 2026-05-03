# 📚 MicroBooks — Bookstore Management System

Hệ thống quản lý bán sách áp dụng kiến trúc **Microservices** với giao tiếp bất đồng bộ qua **Apache Kafka**.

## 🏗️ Kiến trúc

```
┌─────────────┐     REST API     ┌─────────────────┐
│   Frontend  │◄────────────────►│  Order Service   │
│  (Next.js)  │                  │  (Express:3001)  │
│   :3000     │     REST API     │                  │
│             │◄──────┐         └────────┬──────────┘
└─────────────┘       │                  │ Publish
                      │                  ▼
               ┌──────┴────────┐  ┌──────────────┐
               │  Inventory    │◄─┤ Apache Kafka │
               │  Service      │  │   :9092      │
               │  (Express:3002)│  └──────────────┘
               └───────┬───────┘    order_created
                       │
                       ▼
               ┌──────────────┐
               │ MongoDB Atlas│
               └──────────────┘
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15 (App Router) |
| Backend | Node.js / Express |
| Database | MongoDB Atlas |
| Message Broker | Apache Kafka |
| Infrastructure | Docker & Docker Compose |

## 📁 Cấu trúc thư mục

```
MicroBooks/
├── frontend/                   # Next.js Frontend
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js
│   │   │   ├── page.js        # Trang chủ
│   │   │   ├── orders/        # Quản lý đơn hàng
│   │   │   └── inventory/     # Quản lý kho sách
│   │   └── components/
│   └── package.json
├── services/
│   ├── order-service/          # Order Microservice
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── config/        # DB + Kafka config
│   │   │   ├── models/        # Mongoose models
│   │   │   ├── routes/
│   │   │   └── controllers/
│   │   └── package.json
│   └── inventory-service/      # Inventory Microservice
│       ├── Dockerfile
│       ├── src/
│       │   ├── index.js
│       │   ├── config/
│       │   ├── models/
│       │   ├── routes/
│       │   └── controllers/
│       └── package.json
├── docker-compose.yml
├── .env
└── .env.example
```

## 🚀 Hướng dẫn chạy

### Yêu cầu
- Docker & Docker Compose
- Node.js 18+ (nếu chạy local)

### Chạy bằng Docker Compose

```bash
# Clone repo
git clone https://github.com/phatle224/micro_books.git
cd micro_books

# Tạo file .env (copy từ .env.example)
cp .env.example .env
# Cập nhật MONGO_URI trong .env

# Khởi chạy toàn bộ hệ thống
docker-compose up --build
```

### Chạy local (không Docker)

```bash
# Terminal 1: Order Service
cd services/order-service
npm install
npm run dev

# Terminal 2: Inventory Service
cd services/inventory-service
npm install
npm run dev

# Terminal 3: Frontend
cd frontend
npm install
npm run dev
```

### Truy cập

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Order Service API | http://localhost:3001/api/orders |
| Inventory Service API | http://localhost:3002/api/books |

## 📡 API Endpoints

### Order Service (Port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Lấy tất cả đơn hàng |
| GET | `/api/orders/:id` | Lấy chi tiết đơn hàng |
| POST | `/api/orders` | Tạo đơn hàng mới |
| PUT | `/api/orders/:id` | Cập nhật trạng thái |
| DELETE | `/api/orders/:id` | Xóa đơn hàng |

### Inventory Service (Port 3002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Lấy tất cả sách |
| GET | `/api/books/:id` | Lấy chi tiết sách |
| POST | `/api/books` | Thêm sách mới |
| PUT | `/api/books/:id` | Cập nhật sách |
| DELETE | `/api/books/:id` | Xóa sách |

## ⚡ Luồng Event-Driven

1. Client tạo đơn hàng → **Order Service** lưu vào MongoDB
2. Order Service publish event `order_created` lên **Kafka topic**
3. **Inventory Service** subscribe topic, nhận event
4. Inventory Service tự động trừ tồn kho trong MongoDB

## 👥 Team
- Lê Hồng Phát
- Trương Quốc Kiệt
