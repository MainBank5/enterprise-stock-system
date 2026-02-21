# Enterprise Stock System

An event-driven microservices system built with NestJS, RabbitMQ, Graphile Worker, and PostgreSQL. This project demonstrates how to design scalable, loosely coupled backend systems using asynchronous messaging, background processing, and containerized infrastructure.

---

# Highlights

* Event-driven microservices architecture
* Asynchronous email processing using background workers
* Message-based communication via RabbitMQ (Pub/Sub)
* Clean architecture with NestJS dependency injection
* Fully containerized using Docker
* Production-style service separation and infrastructure

---

# Architecture Overview

**Core architectural pattern:** Event-Driven Architecture with Message Queues

```id="4m5nsz"
Client
  │
  ▼
API Gateway
  │
  ├── Auth Service
  ├── Availability Service
  ├── Orders Service
  └── Payment Service
          │
          ▼
       RabbitMQ
      (Event Bus)
          │
          ▼
     Email Service
   (Graphile Worker)
```

**Key design decisions:**

* Services communicate asynchronously via events, reducing tight coupling
* Background workers handle non-critical tasks to improve system responsiveness
* Shared event contracts ensure consistency between services
* Each service is independently deployable and scalable

---

# Tech Stack

**Backend**

* NestJS
* TypeScript
* PostgreSQL

**Messaging & Jobs**

* RabbitMQ
* Graphile Worker

**Infrastructure**

* Docker
* Docker Compose

---

# Project Structure

```bash id="l9r71t"
enterprise-stock-system/

├── api-gateway/
├── auth-service/
├── availability-service/
├── orders-service/
├── payment-service/
├── email-service/
├── shared/
│   └── events.ts
├── docker-compose.yml
└── README.md
```

---

# Event Flow

1. User initiates purchase via API Gateway
2. Order and payment services process transaction
3. Payment service publishes event to RabbitMQ
4. Email service consumes event
5. Graphile Worker processes email job asynchronously

This ensures the main transaction flow remains fast and resilient.

---

# What This Demonstrates

This project showcases practical experience with:

* Designing distributed systems
* Building event-driven architectures
* Implementing asynchronous workflows
* Structuring scalable NestJS microservices
* Using message brokers in production-style systems
* Containerizing multi-service applications

---

# Running the Project

```bash id="b0pp9i"
docker-compose up --build
```

---

# Author

Eliud Karuga
Backend Engineer focused on scalable systems, microservices, and cloud architecture
