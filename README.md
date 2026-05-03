<div align="center">

  <!-- Header với tiêu đề mới -->
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=150&section=header&text=Microbooks%20in%20Docker&fontSize=40&fontAlignY=35&animation=twinkling&fontColor=ffffff" width="100%" alt="Header"/>

  <!-- Link và hiệu ứng chữ chạy -->
  <a href="https://github.com/Kietnehi/Microbooks-Docker">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&pause=1000&color=2496ED&center=true&vCenter=true&width=600&lines=🐳+Containerized+Microservices+Architecture;📚+Microbooks+Library+Management+System;🛠️+Docker+Compose+%7C+Go+Micro+%7C+PostgreSQL" alt="Typing SVG" />
  </a> 

</div>

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
| <p align="center"><img src="https://img.shields.io/github/followers/Kietnehi?style=for-the-badge"/> <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github-star-counter.workers.dev%2Fuser%2FKietnehi&query=%24.stars&style=for-the-badge&color=yellow&label=Stars&logo=github"/> <a href="https://github.com/Kietnehi"><img src="https://img.shields.io/badge/Profile-GitHub-181717?style=for-the-badge&logo=github"/></a></p> | <p align="center"><img src="https://img.shields.io/github/followers/phatle224?style=for-the-badge"/> <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github-star-counter.workers.dev%2Fuser%2Fphatle224&query=%24.stars&style=for-the-badge&color=yellow&label=Stars&logo=github"/> <a href="https://github.com/phatle224"><img src="https://img.shields.io/badge/Profile-GitHub-181717?style=for-the-badge&logo=github"/></a></p> |

<p align="center">
  <a href="https://github.com/Kietnehi/Microbooks-Docker">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=2496ED&center=true&vCenter=true&width=500&lines=Microbooks+in+Docker;Containerized+Microservices" alt="Typing SVG" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/SGU-Sai_Gon_University-0056D2?style=flat-square" alt="SGU" />
  <img src="https://img.shields.io/badge/Base-Ho_Chi_Minh_City-FF4B4B?style=flat-square" alt="HCMC" />
</p>

### 🛠 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=docker,go,postgres,react,nodejs,mongodb,git,nginx" alt="Tech Stack" />
</p>

### 🐳 MICROBOOKS IN DOCKER

<p align="center">
  <a href="https://github.com/Kietnehi/Microbooks-Docker">
    <img src="https://img.shields.io/github/stars/Kietnehi/Microbooks-Docker?style=for-the-badge&color=yellow" alt="Stars" />
    <img src="https://img.shields.io/github/forks/Kietnehi/Microbooks-Docker?style=for-the-badge&color=orange" alt="Forks" />
    <img src="https://img.shields.io/github/issues/Kietnehi/Microbooks-Docker?style=for-the-badge&color=red" alt="Issues" />
  </a>
</p>

<!-- Quote động -->
<p align="center">
  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=dark" alt="Daily Quote"/>
</p>

<p align="center">
  <i>Thank you for stopping by! Don’t forget to give this repo a <b>⭐️ Star</b> if you find it useful.</i>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=80&section=footer"/>