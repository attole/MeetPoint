# MeetPoint

> Web application that helps users organize meetups by suggesting the most convenient meeting spots.
> Instead of just finding the geometric midpoint between participants, it considers users’ preferences, routes, and estimated travel times to suggest the most convenient meeting spots in real time, continuously updating as participants move.

---

## Table of Contents

- [Architecture & Stack](#architecture--stack)
- [Features](#features)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [License](#license)

---

## Architecture & Stack

The system is built on a client–server architecture and is fully containerized using Docker and Docker Compose. It follows **Clean Architecture principles**, ensuring separation of concerns and maintainable code. The backend is structured as a **modular monolith**, meaning all modules live in a single application but are organized into distinct layers and projects for clarity and scalability.

- **Layers & Responsibilities**
  - **Domain (MeetPoint.Domain/)** – core business logic, entities, and value objects. No dependencies on frameworks or infrastructure.
  - **Application (MeetPoint.Application/)** – use cases, DTOs, and service interfaces. Depends only on the Domain layer, orchestrates business rules.
  - **Infrastructure (MeetPoint.Infrastructure/)** – persistence, database access (EF Core, PostgreSQL), caching (Redis), JWT authentication, SignalR services for multi-user sessions, and Google Maps data service. Implements interfaces from the Application layer.
  - **API (MeetPoint.API/)** – controllers, DTOs. Depends on Application layer via interfaces.
  - **Frontend (MeetPoint.Frontend/)** – Angular application with RxJS, Material UI 3, and Google Maps integration. Communicates with backend via **ASP.NET Core Web API**.

- **Monolith Approach**
  - All backend layers reside in a single solution/project structure, avoiding distributed services.  
  - Modular structure allows independent development, testing, and maintenance of each layer while keeping deployment simple.  
  - Easier to manage dependencies and ensures consistency across the system without introducing inter-service network complexity.

- **Dependencies Flow**
  - Domain → Application → Infrastructure → API  
  - Frontend communicates with API via **REST endpoints** and **SignalR WebSockets**.  
  - Infrastructure implements interfaces defined in Application, Application orchestrates Domain entities, API exposes endpoints.

- **Backend**
  - [ASP.NET Core Web API](https://dotnet.microsoft.com/en-us/apps/aspnet) with clean architecture
  - ASP.NET Identity + [JWT](https://jwt.io/) authentication
  - [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/) for database object-relational mapping
  - [PostgreSQL](https://www.postgresql.org/) persistence database
  - [Redis](https://redis.io/) caching sessions data
  - SignalR for concurrent multi-user sessions

- **Frontend**  
  - [Angular](https://angular.io/) with [RxJS](https://rxjs.dev/)
  - [Material UI 3](https://material.angular.io/)
  - [Google Maps Platform](https://developers.google.com/maps) geodata source integration

- **HTTP Web Server** - [Nginx](https://www.nginx.com/)
  - In production, it delivers the frontend static files and proxies API requests to the backend.
  - For local development, Nginx is **optional** — the frontend Angular dev server and ASP.NET Core Web API can run independently on their respective ports (`3000` for frontend, `5001` for API).

- **Containerization**
  - Docker / Docker Compose for all services
  - Backend: `dev` and `prod` Dockerfiles
  - Frontend: Angular Dockerfile
  - Full stack runs in isolated containers: backend, frontend, Postgres, Redis, Nginx

- **Algorithms**  
  - Geospatial processing for route calculation
  - Dynamic determination of optimal meeting points

---

## Features

- User authentication
- Friends system
- Multi-user sessions with SignalR
- Shared map views and real-time geolocation
- Smart list of optimal meeting locations
- Algorithms for route optimization and dynamic best-point selection

---

## Installation

**MeetPoint** is fully containerized using Docker, so all components (backend, frontend, database, cache) run inside containers. You don’t need to install .NET, Node, or any other runtime locally.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Local Setup & Run

Clone the repository and start all services with Docker Compose:

```bash
	git clone https://github.com/attole/MeetPoint.git
	cd MeetPoint
	docker-compose up --build
```

This will start all components in a fully isolated environment:

- **Backend**
  - Development: uses `docker/dev.Dockerfile` with `dotnet watch run` for live development.
  - Production: uses `docker/prod.Dockerfile` build and publish the API for production.
  - Exposed internally on port `8080` and mapped to host `5001`.
- **Frontend**
  - Development: Angular dev server via `src/MeetPoint.Frontend/dev.Dockerfile`.
  - Runs on port `3000` inside the container.
  - Production: Nginx serves the built frontend static files on port `5000` and proxies API requests to the backend.
- **Database & Cache**
  - Start PostgreSQL and Redis containers
- **Reverse Proxy**  
  - Nginx serves frontend static files and proxies backend API requests in production.
  - Optional in development; frontend and backend can run independently.

To stop all services:

```bash
	docker-compose down
```

### Notes

- This setup is intended for **local development and testing**. For production, use the `prod` Dockerfile for the backend and adjust environment variables and configure Nginx accordingly.  
- To stop all services:  
`docker-compose down`  
- No local runtime installations are required; all development, testing, and runtime operations run fully inside Docker containers.

---

## Project Structure

- `src/`
  - `MeetPoint.Domain/` ─ core entities and value objects
  - `MeetPoint.Application/` ─ use cases, DTOs, interfaces
  - `MeetPoint.Infrastructure/` ─ EF Core, PostgreSQL, Redis, other external services
  - `MeetPoint.API/` ─ controllers, DTOs, web application setup
  - `MeetPoint.Frontend/` ─ Angular app (RxJS, Material UI, Google Maps)
- `docker/` ─ Dockerfiles and configs
- `docker-compose.yml`

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
