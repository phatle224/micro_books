<div align="center">

  <!-- Header với tiêu đề mới -->
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=150&section=header&text=Microbooks%20in%20Docker&fontSize=40&fontAlignY=35&animation=twinkling&fontColor=ffffff" width="100%" alt="Header"/>

  <!-- Link và hiệu ứng chữ chạy -->
  <a href="https://github.com/phatle224/micro_books">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&pause=1000&color=2496ED&center=true&vCenter=true&width=600&lines=🐳+Containerized+Microservices+Architecture;📚+Microbooks+Library+Management+System;🛠️+Docker+Compose+%7C+FastAPI+%7C+MongoDB+Atlas" alt="Typing SVG" />
  </a> 

</div>

# 📚 MicroBooks — Bookstore Management System

Hệ thống quản lý bán sách áp dụng kiến trúc **Microservices** với giao tiếp bất đồng bộ qua **Apache Kafka** và lưu trữ dữ liệu trên **MongoDB Atlas**.

## 🏗️ Kiến trúc

```
┌─────────────┐     REST API     ┌─────────────────┐
│   Frontend  │◄────────────────►│  Order Service   │
│  (Next.js)  │                  │  (FastAPI:3001)  │
│   :3000     │     REST API     │                  │
│             │◄──────┐         └────────┬──────────┘
└─────────────┘       │                  │ Publish
                      │                  ▼
               ┌──────┴────────┐  ┌──────────────┐
               │  Inventory    │◄─┤ Apache Kafka │
               │  Service      │  │   :9092      │
               │  (FastAPI:3002)│  └──────┬───────┘
               └───────┬───────┘         │ Monitor
                       │          ┌──────▼───────┐
                       │          │   Kafka UI   │
                       │          │    :8080     │
                       ▼          └──────────────┘
               ┌──────────────┐
               │ MongoDB Atlas│
               └──────────────┘
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15 (App Router) |
| Backend | Python / FastAPI |
| Database | MongoDB Atlas |
| Message Broker | Apache Kafka |
| Kafka Monitoring | Kafka UI (provectuslabs) |
| Infrastructure | Docker & Docker Compose |

## 📁 Cấu trúc thư mục

```
MicroBooks/
├── frontend/                   # Next.js Frontend
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/
│   │   │   ├── (storefront)/  # Trang khách hàng
│   │   │   └── admin/         # Trang quản trị
│   │   └── components/
│   └── package.json
├── order-service/              # Order Microservice (Python)
│   ├── Dockerfile
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── routes.py
│   │   └── kafka_producer.py
│   └── requirements.txt
├── inventory-service/          # Inventory Microservice (Python)
│   ├── Dockerfile
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── routes.py
│   │   └── kafka_consumer.py
│   └── requirements.txt
├── docker-compose.yml
├── .env
└── .env.example
```

## 🚀 Hướng dẫn chạy

### Yêu cầu
- Docker & Docker Compose
- Python 3.10+ (nếu chạy local)
- Node.js 18+ (nếu chạy local frontend)

### Chạy bằng Docker Compose

```bash
# Clone repo
git clone https://github.com/phatle224/micro_books.git
cd micro_books

# Tạo file .env (copy từ .env.example)
cp .env.example .env

# CẬP NHẬT MONGO_URI TRONG .ENV VỚI KẾT NỐI MONGODB ATLAS CỦA BẠN
# Ví dụ: MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/

# Khởi chạy toàn bộ hệ thống
docker-compose up --build
```

### Chạy local (không Docker)

Lưu ý: Bạn cần cài đặt Kafka và MongoDB local hoặc sử dụng Atlas.

```bash
# Terminal 1: Order Service
cd order-service
pip install -r requirements.txt
uvicorn app.main:app --port 3001 --reload

# Terminal 2: Inventory Service
cd inventory-service
pip install -r requirements.txt
uvicorn app.main:app --port 3002 --reload

# Terminal 3: Frontend
cd frontend
npm install
npm run dev
```

### Truy cập

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Order Service API | http://localhost:3001/api/orders (Docs: /docs) |
| Inventory Service API | http://localhost:3002/api/books (Docs: /docs) |
| Kafka UI | http://localhost:8080 |

## 🔐 Hệ quản trị (Admin Portal)

Bạn có thể truy cập vào trang quản trị để quản lý kho sách, đơn hàng và theo dõi Kafka:

- **URL:** `http://localhost:3000/admin/login`
- **Tài khoản:** `admin@microbooks.com`
- **Mật khẩu:** `admin123`

| Trang | Mô tả |
|-------|-------|
| `/admin` | Dashboard tổng quan |
| `/admin/books` | Quản lý kho sách |
| `/admin/orders` | Quản lý đơn hàng |
| `/admin/kafka` | Kafka Monitor (embed Kafka UI) |

## 📡 API Endpoints

### Order Service (Port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Lấy tất cả đơn hàng |
| GET | `/api/orders/{id}` | Lấy chi tiết đơn hàng |
| POST | `/api/orders` | Tạo đơn hàng mới |
| PATCH | `/api/orders/{id}` | Cập nhật trạng thái |
| GET | `/api/orders/stats/summary` | Thống kê đơn hàng (Admin) |

### Inventory Service (Port 3002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Lấy tất cả sách |
| GET | `/api/books/{id}` | Lấy chi tiết sách |
| POST | `/api/books` | Thêm sách mới |
| PUT | `/api/books/{id}` | Cập nhật sách |
| DELETE | `/api/books/{id}` | Xóa sách |
| GET | `/api/books/categories` | Lấy danh mục sách |
| GET | `/api/books/stats/summary` | Thống kê kho sách (Admin) |

## ⚡ Luồng Event-Driven

1. Client tạo đơn hàng → **Order Service** lưu vào MongoDB Atlas.
2. Order Service publish event `order_created` lên **Kafka topic**.
3. **Inventory Service** subscribe topic, nhận event.
4. Inventory Service tự động trừ tồn kho của sách tương ứng trong MongoDB Atlas.
5. Toàn bộ hoạt động broker có thể theo dõi real-time qua **Kafka UI** tại `localhost:8080` hoặc trang `/admin/kafka`.

## 📊 Kafka Monitoring

Hệ thống tích hợp **[Kafka UI](https://github.com/provectus/kafka-ui)** để quan sát luồng message:

- **Brokers** — Xem trạng thái broker, replica, partition
- **Topics** — Duyệt messages trong topic `order_created`
- **Consumer Groups** — Theo dõi lag của `inventory-service-group`
- **Schema Registry** — Quản lý schema (nếu cần)

> Kafka UI được nhúng trực tiếp vào trang Admin tại `/admin/kafka` và cũng có thể mở riêng tại `http://localhost:8080`.


## 🔗 Các tác giả & Tài khoản Github

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=header" alt="header" />
</p>

| | |
| :---: | :---: |
| <a href="https://github.com/Kietnehi"><img src="https://github-readme-stats.vercel.app/api?username=Kietnehi&show_icons=true&hide_title=true&hide=issues,contribs,prs&rank_icon=github&hide_border=true"/></a> | <a href="https://github.com/phatle224"><img src="https://github-readme-stats.vercel.app/api?username=phatle224&show_icons=true&hide_title=true&hide=issues,contribs,prs&rank_icon=github&hide_border=true"/></a> |
| <img src="https://github.com/Kietnehi.png" width="80"/> | <img src="https://github.com/phatle224.png" width="80"/> |
| <b><a href="https://github.com/Kietnehi">Trương Phú Kiệt</a></b> | <b><a href="https://github.com/phatle224">Phát Lê</a></b> |
| Fullstack Dev & DevOps | Data Engineer & Backend |

### 🛠 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=docker,python,fastapi,react,nextjs,mongodb,git,kafka" alt="Tech Stack" />
</p>

<p align="center">
  <i>Thank you for stopping by! Don’t forget to give this repo a <b>⭐️ Star</b> if you find it useful.</i>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=80&section=footer"/>
