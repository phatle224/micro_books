<div align="center">

  <!-- Header với tiêu đề mới -->
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=150&section=header&text=Microbooks%20v2.0&fontSize=40&fontAlignY=35&animation=twinkling&fontColor=ffffff" width="100%" alt="Header"/>

  <!-- Link và hiệu ứng chữ chạy -->
  <a href="https://github.com/phatle224/micro_books">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&pause=1000&color=2496ED&center=true&vCenter=true&width=600&lines=🐳+Self-hosted+CI/CD+Pipeline;📚+Microbooks+v2.0+Architecture;🛠️+Docker+Compose+%7C+FastAPI+%7C+Kafka" alt="Typing SVG" />
  </a> 

</div>

# 📚 MicroBooks — Bookstore Management System (v2.0)

Hệ thống quản lý bán sách áp dụng kiến trúc **Microservices** hiện đại, giao tiếp bất đồng bộ qua **Apache Kafka**, lưu trữ dữ liệu trên **MongoDB Atlas** và tích hợp quy trình **CI/CD tự động** trên máy local.

## 🏗️ Kiến trúc Hệ thống

```
┌─────────────┐     REST API     ┌─────────────────┐
│   Frontend  │◄────────────────►│  order_service  │
│  (Next.js)  │                  │  (FastAPI:3001) │
│   :3000     │     REST API     │                 │
│             │◄──────┐         └────────┬─────────┘
└─────────────┘       │                  │ Publish
                      │                  ▼
               ┌──────┴────────┐  ┌──────────────┐
               │ inventory_    │◄─┤ Apache Kafka │
               │ service       │  │   :9092      │
               │ (FastAPI:3002)│  └──────┬───────┘
               └───────┬───────┘         │ Monitor
                       │          ┌──────▼───────┐
                       │          │   Kafka UI   │
                       │          │    :8080     │
                       ▼          └──────────────┘
               ┌──────────────┐
               │ MongoDB Atlas│
               └──────────────┘
```

## 🛠️ Tech Stack & DevOps

| Thành phần | Công nghệ |
|-----------|------------|
| **Frontend** | Next.js 15 (App Router), Tailwind CSS |
| **Backend** | Python 3.10+, FastAPI |
| **Database** | MongoDB Atlas (Cloud) |
| **Message Broker** | Apache Kafka & Zookeeper |
| **Monitoring** | Kafka UI (provectuslabs) |
| **Infrastructure** | Docker & Docker Compose |
| **CI/CD** | GitHub Actions (Self-hosted Runner) |

## 📁 Cấu trúc thư mục mới

```bash
MicroBooks/
├── .github/workflows/          # Quy trình CI/CD (Local Deployment)
├── frontend/                   # Next.js Frontend Application
├── order_service/              # Dịch vụ Quản lý Đơn hàng (Python)
├── inventory_service/          # Dịch vụ Quản lý Kho (Python)
├── tests/                      # Kiểm thử tích hợp (Integration Tests)
├── docs/                       # Tài liệu thiết kế (PRD, Design)
├── docs_self_host_runner/      # Tài liệu cấu hình CI/CD Runner
├── docker-compose.yml          # File điều phối Docker containers
├── .env                        # Biến môi trường (Cấu hình)
└── README.md
```

## 🚀 Quy trình CI/CD (Self-hosted Runner)

Hệ thống đã được tích hợp quy trình **Automation** hoàn chỉnh:
1. **Continuous Integration (CI):** Tự động kiểm tra code và chạy unit tests khi có Pull Request hoặc Push vào branch `main`.
2. **Continuous Deployment (CD):** Sử dụng **GitHub Actions Self-hosted Runner** cài đặt trực tiếp trên máy chủ local. 
   - Khi CI thành công, Runner sẽ tự động `docker-compose pull` và `docker-compose up -d`.
   - Đảm bảo môi trường local luôn đồng bộ với code mới nhất trên GitHub mà không cần thao tác tay.

> Xem chi tiết tại: [local-deploy.yml](.github/workflows/local-deploy.yml)

## 🛠️ Hướng dẫn cài đặt

### Chạy bằng Docker Compose (Khuyên dùng)

```bash
# 1. Clone repo
git clone https://github.com/phatle224/micro_books.git
cd micro_books

# 2. Cấu hình môi trường
cp .env.example .env
# Cập nhật MONGO_URI và DOCKER_HUB_USERNAME trong .env

# 3. Khởi chạy
docker-compose up --build -d
```

### Truy cập các dịch vụ

| Service | URL | Mô tả |
|---------|-----|-------|
| **Storefront** | [http://localhost:3000](http://localhost:3000) | Giao diện mua sắm |
| **Admin Portal** | [http://localhost:3000/admin](http://localhost:3000/admin) | Quản lý hệ thống |
| **Kafka UI** | [http://localhost:8080](http://localhost:8080) | Giám sát hàng đợi tin nhắn |
| **Order API Docs** | [http://localhost:3001/docs](http://localhost:3001/docs) | Swagger UI (Order Service) |
| **Inventory API Docs** | [http://localhost:3002/docs](http://localhost:3002/docs) | Swagger UI (Inventory Service) |

## 📊 Kafka Monitoring (User Access)

Chúng tôi cung cấp giao diện trực quan để người dùng và nhà phát triển có thể theo dõi các luồng sự kiện (Event-driven):
- **Kafka UI:** Truy cập tại [http://localhost:8080](http://localhost:8080).
- Tại đây bạn có thể xem các topic như `order_created`, kiểm tra message payload và theo dõi trạng thái của các Consumers (Inventory Service).

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
| <p align="center"><img src="https://img.shields.io/github/followers/Kietnehi?style=for-the-badge&logo=github"/> <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github-star-counter.workers.dev%2Fuser%2FKietnehi&query=%24.stars&style=for-the-badge&color=yellow&label=Stars&logo=github"/> <a href="https://github.com/Kietnehi"><img src="https://img.shields.io/badge/Profile-GitHub-181717?style=for-the-badge&logo=github"/></a></p> | <p align="center"><img src="https://img.shields.io/github/followers/phatle224?style=for-the-badge&logo=github"/> <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github-star-counter.workers.dev%2Fuser%2Fphatle224&query=%24.stars&style=for-the-badge&color=yellow&label=Stars&logo=github"/> <a href="https://github.com/phatle224"><img src="https://img.shields.io/badge/Profile-GitHub-181717?style=for-the-badge&logo=github"/></a></p> |

<p align="center">
  <a href="https://github.com/phatle224/micro_books">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=2496ED&center=true&vCenter=true&width=500&lines=Microbooks+in+Docker;Containerized+Microservices" alt="Typing SVG" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/SGU-Sai_Gon_University-0056D2?style=flat-square" alt="SGU" />
  <img src="https://img.shields.io/badge/Base-Ho_Chi_Minh_City-FF4B4B?style=flat-square" alt="HCMC" />
</p>

### 🛠 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=docker,go,postgres,react,nodejs,mongodb,git,nginx,kafka" alt="Tech Stack" />
</p>

### 🐳 MICROBOOKS IN DOCKER

<p align="center">
  <a href="https://github.com/phatle224/micro_books">
    <img src="https://img.shields.io/github/stars/phatle224/micro_books?style=for-the-badge&logo=github" alt="Stars" />
    <img src="https://img.shields.io/github/forks/phatle224/micro_books?style=for-the-badge&logo=github" alt="Forks" />
    <img src="https://img.shields.io/github/issues/phatle224/micro_books?style=for-the-badge&color=red" alt="Issues" />
  </a>
</p>

<!-- Quote động -->
<p align="center">
  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=dark" alt="Daily Quote"/>
</p>

<p align="center">
  <i>Thank you for stopping by! Don’t forget to give this repo a <b>⭐️ Star</b> if you find it useful..</i>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=80&section=footer"/>
