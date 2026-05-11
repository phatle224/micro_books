<div align="center">

<!-- Header with new title -->

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=150&section=header&text=Microbooks%20v2.0&fontSize=40&fontAlignY=35&animation=twinkling&fontColor=ffffff" width="100%" alt="Header"/>

<!-- Link and Typing SVG effect -->

<a href="https://github.com/phatle224/micro_books">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&pause=1000&color=2496ED&center=true&vCenter=true&width=600&lines=🐳+Self-hosted+CI/CD+Pipeline;📚+Microbooks+v2.0+Architecture;🛠️+Docker+Compose+%7C+FastAPI+%7C+Kafka" alt="Typing SVG" />
  </a>

<!-- Badges -->

<p align="center">
    <a href="https://github.com/phatle224/micro_books/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/phatle224/micro_books?style=flat-square&color=blue" alt="License" />
    </a>
    <img src="https://img.shields.io/github/stars/phatle224/micro_books?style=flat-square&color=yellow" alt="Stars" />
    <img src="https://img.shields.io/github/forks/phatle224/micro_books?style=flat-square&color=lightgrey" alt="Forks" />
    <img src="https://img.shields.io/github/issues/phatle224/micro_books?style=flat-square&color=red" alt="Issues" />
    <img src="https://img.shields.io/badge/python-3.10+-blue?style=flat-square&logo=python" alt="Python" />
    <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
    <img src="https://img.shields.io/github/actions/workflow/status/phatle224/micro_books/local-deploy.yml?branch=main&style=flat-square&label=CI/CD" alt="CI/CD Status" />
  </p>

</div>

# 📚 MicroBooks — Bookstore Management System (v2.0)

**MicroBooks v2.0** is a production-grade, event-driven microservices system built with FastAPI, Next.js, and Apache Kafka. It features an automated CI/CD pipeline via GitHub Actions and a comprehensive observability stack. Containerized with Docker and Kubernetes-ready, it provides a robust, scalable environment for modern software development.

---

Modern Microservices-based bookstore management system using **Apache Kafka** for asynchronous communication, **MongoDB Atlas** for cloud storage, and integrated automated **CI/CD pipelines** for local deployment.

<p align="center">
  <img src="image/readme/pipeline.png" width="100%" alt="CI/CD Pipeline Architecture"/>
</p>

## 🏗️ System Architecture

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

## 🔄 Full System Workflow

Below is a detailed diagram of the operational flow, from code push to user interaction and automated monitoring:

```mermaid
graph TD
    subgraph "1. Development & CI/CD (Automation)"
        Dev[Developer] -- "Push Code" --> GH[GitHub Repository]
        GH -- "Trigger" --> GHA[GitHub Actions]
        GHA -- "Deploy" --> SHR[Self-hosted Runner]
        SHR -- "docker-compose up" --> Docker[Docker Engine]
    end

    subgraph "2. Business Logic (Application Logic)"
        User[User] -- "Place Order" --> Frontend[Next.js Frontend]
        Frontend -- "POST /api/orders" --> OS[Order Service]
        OS -- "Save Order" --> DB[(MongoDB Atlas)]
        OS -- "Publish 'order_created'" --> Kafka{Apache Kafka}
        Kafka -- "Receive Event" --> IS[Inventory Service]
        IS -- "Update Stock" --> DB
    end

    subgraph "3. Monitoring & Observability"
        OS & IS & Frontend -- "Metrics/Traces" --> OTel[OpenTelemetry Collector]
        OTel -- "Metrics" --> Prom[Prometheus]
        OTel -- "Traces" --> Tempo[Tempo]
        Docker -- "Logs" --> Promtail[Promtail]
        Promtail -- "Logs" --> Loki[Loki]
        Prom & Loki & Tempo -- "Dashboard" --> Grafana[Grafana]
        Kafka -- "Monitor" --> KUI[Kafka UI]
    end

    %% Styling
    style GH fill:#24292e,color:#fff
    style Docker fill:#2496ed,color:#fff
    style Kafka fill:#000,color:#fff
    style DB fill:#47a248,color:#fff
    style Grafana fill:#f46800,color:#fff
    style GHA fill:#2088ff,color:#fff
```

## 🛠️ Tech Stack & DevOps

| Component                | Technology                                          |
| ------------------------ | --------------------------------------------------- |
| **Frontend**       | Next.js 15 (App Router), Tailwind CSS               |
| **Backend**        | Python 3.10+, FastAPI                               |
| **Database**       | MongoDB Atlas (Cloud)                               |
| **Message Broker** | Apache Kafka & Zookeeper                            |
| **Monitoring**     | Kafka UI (provectuslabs)                            |
| **Infrastructure** | Docker & Docker Compose                             |
| **CI/CD**          | GitHub Actions (Self-hosted Runner)                 |
| **Observability**  | OpenTelemetry + Prometheus + Grafana + Loki + Tempo |

## 📁 Project Directory Structure

```bash
MicroBooks/
├── .github/workflows/          # CI/CD Workflows (Local Deployment)
├── frontend/                   # Next.js Frontend Application
├── order_service/              # Order Management Service (Python)
├── inventory_service/          # Inventory Management Service (Python)
├── tests/                      # Integration Tests
├── docs/                       # Design Documentation (PRD, Design)
├── docs_self_host_runner/      # CI/CD Runner Configuration Docs
├── k8s/                        # Kubernetes Manifests (Kustomize)
│   └── base/                   # Base configuration
├── .env                        # Environment Variables
└── README.md
```

## 🚀 CI/CD Workflow (Self-hosted Runner)

The system is integrated with a complete **Automation** workflow:

1. **Continuous Integration (CI):** Automatically validates code and runs unit tests upon Pull Request or push to the `main` branch.
2. **Continuous Deployment (CD):** Uses a **GitHub Actions Self-hosted Runner** installed directly on the local server.
   - Upon successful CI, the Runner automatically executes `docker-compose pull` and `docker-compose up -d`.
   - Ensures the local environment is always synchronized with the latest code on GitHub without manual intervention.

> View details at: [local-deploy.yml](.github/workflows/local-deploy.yml)

## 🛠️ Installation Guide

### Run with Docker Compose (Recommended)

```bash
# 1. Clone repo
git clone https://github.com/phatle224/micro_books.git
cd micro_books

# 2. Environment Configuration
cp .env.example .env
# Update MONGO_URI and DOCKER_HUB_USERNAME in .env

# 3. Launch
docker-compose up --build -d
```

### Run with Kubernetes (K8s)

Ensure Kubernetes is enabled in Docker Desktop or Minikube.

```bash
# 1. Deploy the entire system
kubectl apply -k k8s/base

# 2. Wait until all Pods are in Running state
kubectl get pods -n microbooks -w

# 3. Port-forward to access the Frontend (run in a separate terminal)
kubectl port-forward svc/frontend 3000:3000 -n microbooks

# 4. Stop and remove all resources
kubectl delete -k k8s/base
```

### Service Access

| Service                      | URL                                                     | Description                    |
| ---------------------------- | ------------------------------------------------------- | ------------------------------ |
| **Storefront**         | [http://localhost:3000](http://localhost:3000)             | Shopping Interface             |
| **Admin Portal**       | [http://localhost:3000/admin](http://localhost:3000/admin) | System Administration          |
| **Kafka UI**           | [http://localhost:8080](http://localhost:8080)             | Message Queue Monitoring       |
| **Order API Docs**     | [http://localhost:3001/docs](http://localhost:3001/docs)   | Swagger UI (Order Service)     |
| **Inventory API Docs** | [http://localhost:3002/docs](http://localhost:3002/docs)   | Swagger UI (Inventory Service) |

## 📊 Kafka Monitoring (User Access)

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

### Access URLs

| Service               | URL                                            |
| --------------------- | ---------------------------------------------- |
| Frontend              | http://localhost:3000                          |
| Order Service API     | http://localhost:3001/api/orders (Docs: /docs) |
| Inventory Service API | http://localhost:3002/api/books (Docs: /docs)  |
| Kafka UI              | http://localhost:8080                          |

## 📈 Monitoring & Observability

The observability stack is pre-configured using OpenTelemetry + Prometheus + Grafana + Loki + Tempo.

### Access URLs

| Service    | URL                                   |
| ---------- | ------------------------------------- |
| Grafana    | http://localhost:3005 (admin / admin) |
| Prometheus | http://localhost:9090                 |
| Loki       | http://localhost:3100                 |
| Tempo      | http://localhost:3200                 |

### Quick Notes

- Order/Inventory services have OpenTelemetry enabled when running via Docker Compose.
- Metrics are pushed through the OpenTelemetry Collector and scraped by Prometheus.
- Logs are collected using Promtail (docker logs) and displayed via Loki.
- Traces are stored in Tempo and can be viewed in Grafana Explore.

## 🔐 Administration (Admin Portal)

You can access the admin portal to manage the bookstore, orders, and monitor Kafka:

- **URL:** `http://localhost:3000/admin/login`
- **Username:** `admin@microbooks.com`
- **Password:** `admin123`

| Page              | Description                       |
| ----------------- | --------------------------------- |
| `/admin`        | General Dashboard                 |
| `/admin/books`  | Book Inventory Management         |
| `/admin/orders` | Order Management                  |
| `/admin/kafka`  | Kafka Monitor (embedded Kafka UI) |

## 📡 API Endpoints

### Order Service (Port 3001)

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/api/orders`               | Get all orders           |
| GET    | `/api/orders/{id}`          | Get order details        |
| POST   | `/api/orders`               | Create new order         |
| PATCH  | `/api/orders/{id}`          | Update status            |
| GET    | `/api/orders/stats/summary` | Order statistics (Admin) |

### Inventory Service (Port 3002)

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/api/books`               | Get all books                |
| GET    | `/api/books/{id}`          | Get book details             |
| POST   | `/api/books`               | Add new book                 |
| PUT    | `/api/books/{id}`          | Update book                  |
| DELETE | `/api/books/{id}`          | Delete book                  |
| GET    | `/api/books/categories`    | Get book categories          |
| GET    | `/api/books/stats/summary` | Inventory statistics (Admin) |

## ⚡ Event-Driven Workflow

1. Client creates an order → **Order Service** saves it to MongoDB Atlas.
2. Order Service publishes an `order_created` event to the **Kafka topic**.
3. **Inventory Service** subscribes to the topic and receives the event.
4. Inventory Service automatically deducts stock for the corresponding book in MongoDB Atlas.
5. All broker activity can be monitored real-time via **Kafka UI** at `localhost:8080` or the `/admin/kafka` page.

## 📊 Kafka Monitoring

The system integrates **[Kafka UI](https://github.com/provectus/kafka-ui)** for message flow observation:

- **Brokers** — View broker status, replicas, and partitions.
- **Topics** — Browse messages in the `order_created` topic.
- **Consumer Groups** — Monitor lag for the `inventory-service-group`.
- **Schema Registry** — Manage schemas (if applicable).

> Kafka UI is embedded directly into the Admin page at `/admin/kafka` and can also be opened separately at `http://localhost:8080`.

We provide an intuitive interface for users and developers to track event-driven flows:

- **Kafka UI:** Access at [http://localhost:8080](http://localhost:8080).
- Here you can view topics like `order_created`, inspect message payloads, and monitor the status of Consumers (Inventory Service).

## 🔗 Authors & GitHub Profiles

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=header" alt="header" />
</p>

|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                                                `<a href="https://github.com/Kietnehi"><img src="https://github-readme-stats.vercel.app/api?username=Kietnehi&show_icons=true&hide_title=true&hide=issues,contribs,prs&rank_icon=github&hide_border=true"/>``</a>`                                                                                                                                |                                                                                                                                 `<a href="https://github.com/phatle224"><img src="https://github-readme-stats.vercel.app/api?username=phatle224&show_icons=true&hide_title=true&hide=issues,contribs,prs&rank_icon=github&hide_border=true"/>``</a>`                                                                                                                                 |
|                                                                                                                                                                                                              `<img src="https://github.com/Kietnehi.png" width="80"/>`                                                                                                                                                                                                              |                                                                                                                                                                                                               `<img src="https://github.com/phatle224.png" width="80"/>`                                                                                                                                                                                                               |
|                                                                                                                                                                                                         `<b><a href="https://github.com/Kietnehi">`Kiet Truong`</a></b>`                                                                                                                                                                                                         |                                                                                                                                                                                                            `<b><a href="https://github.com/phatle224">`Phat Le`</a></b>`                                                                                                                                                                                                            |
|                                                                                                                                                                                                                                Fullstack Dev & DevOps                                                                                                                                                                                                                                |                                                                                                                                                                                                                                 Data Engineer & Backend                                                                                                                                                                                                                                 |
| `<p align="center"><img src="https://img.shields.io/github/followers/Kietnehi?style=for-the-badge&logo=github"/>` `<img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github-star-counter.workers.dev%2Fuser%2FKietnehi&query=%24.stars&style=for-the-badge&color=yellow&label=Stars&logo=github"/>` `<a href="https://github.com/Kietnehi"><img src="https://img.shields.io/badge/Profile-GitHub-181717?style=for-the-badge&logo=github"/>``</a></p>` | `<p align="center"><img src="https://img.shields.io/github/followers/phatle224?style=for-the-badge&logo=github"/>` `<img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github-star-counter.workers.dev%2Fuser%2Fphatle224&query=%24.stars&style=for-the-badge&color=yellow&label=Stars&logo=github"/>` `<a href="https://github.com/phatle224"><img src="https://img.shields.io/badge/Profile-GitHub-181717?style=for-the-badge&logo=github"/>``</a></p>` |

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

<!-- Dynamic Quote -->

<p align="center">
  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=dark" alt="Daily Quote"/>
</p>

<p align="center">
  <i>Thank you for stopping by! Don’t forget to give this repo a <b>⭐️ Star</b> if you find it useful.</i>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=80&section=footer"/>
