# CloudOps Manager

A cloud infrastructure management platform developed as an engineering project.

## 1. Project Overview

CloudOps Manager aims to provide a centralized platform for managing cloud infrastructure resources, monitoring services, and managing infrastructure teams.

### Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT |
| API Documentation | Swagger |
| Containerization | Docker, Docker Compose |
| Deployment Target | AWS |

## 2. Project Structure

```text
cloudops-manager/
│
├── backend/
│   ├── prisma/             # Database schema, migrations and seed
│   ├── src/                # NestJS application
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # Reusable UI components
│   │   └── lib/            # API utilities
│   ├── Dockerfile
│   └── package.json
│
├── docs/
│   ├── diagrams/
│   └── requirements.md
│
├── docker-compose.yml
└── README.md
```

## 3. Requirements

Install the following before starting:

- Git
- Docker Desktop
- Docker Compose (included with Docker Desktop)

No separate PostgreSQL, Node.js, or npm installation is required when using Docker Compose.

## 4. Running the Project

All commands below should be executed from the repository root.

### Step 1 — Clone the repository

```bash
git clone https://github.com/MedMassous/cloudops-manager.git
cd cloudops-manager
```

### Step 2 — Start the application

```bash
docker compose up -d --build
```

This starts three containers:

| Service | URL / Port |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api |
| Swagger | http://localhost:3001/docs |
| PostgreSQL | localhost:5433 |

### Step 3 — Initialize the database

Run the seed command once on a fresh database:

```bash
docker compose exec backend npx prisma db seed
```

This creates the initial development administrator account.

### Step 4 — Access the application

Open:

http://localhost:3000/login

Development administrator credentials:

```text
Email: admin@cloudops.local
Password: Admin123!
```

**Note:** These are development credentials only. Never use them in production.

## 5. Useful Docker Commands

| Purpose | Command |
|---|---|
| Start services | `docker compose up -d` |
| Build and start | `docker compose up -d --build` |
| Stop services | `docker compose down` |
| View running containers | `docker compose ps` |
| View all logs | `docker compose logs -f` |
| Backend logs | `docker compose logs -f backend` |
| Frontend logs | `docker compose logs -f frontend` |
| Database logs | `docker compose logs -f postgres` |
| Rebuild frontend | `docker compose up -d --build frontend` |
| Rebuild backend | `docker compose up -d --build backend` |

**Important:** `docker compose down -v` deletes the PostgreSQL data volume. Avoid using it unless you intentionally want to reset the database.

## 6. Current Development Progress

The project is being developed incrementally.

### Implemented

- [x] Initial frontend dashboard and navigation
- [x] Docker Compose environment
- [x] PostgreSQL container
- [x] NestJS backend
- [x] Prisma database integration
- [x] JWT authentication
- [x] User roles: Admin, DevOps, Viewer
- [x] Login page
- [x] Frontend API utility with JWT authorization
- [x] Projects module connected to backend
- [x] Projects CRUD operations:
  - Create projects
  - List projects
  - Update projects
  - Delete projects
- [x] Database persistence verified

### In Progress / Remaining

- [ ] Connect Dashboard statistics to real database data
- [ ] Connect Servers module to backend
- [ ] Connect Applications module to backend
- [ ] Implement Monitoring integration
- [ ] Implement Alerts integration
- [ ] Connect Users management
- [ ] Complete Settings functionality
- [ ] Improve authentication and session handling
- [ ] Add automated tests
- [ ] Deploy the application to AWS

**Current milestone:** Authentication and Projects CRUD are implemented and tested locally. The remaining resource pages still contain prototype data and need backend integration.

## 7. Backend API

The backend API is documented using Swagger.

Open:

http://localhost:3001/docs

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve authenticated user |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Retrieve a project |
| PATCH | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

Project data currently includes:

- Project name
- Description
- Creation date
- Last update date

### Roles

| Role | Permissions |
|---|---|
| Admin | Full administrative access |
| DevOps | Manage infrastructure resources |
| Viewer | Read-only access |

Actual permissions are enforced by the backend.

## 8. Development Workflow

We use feature branches instead of working directly on `main`.

### Before starting a new task

```bash
git switch main
git pull origin main
```

### Create a feature branch

```bash
git switch -c feat/feature-name
```

Examples:

```bash
git switch -c feat/dashboard-integration
git switch -c feat/servers-api
```

### Save and push your work

```bash
git add .
git commit -m "feat: describe your changes"
git push -u origin feat/feature-name
```

Then open a Pull Request on GitHub and merge into `main` after review.

### Important rules

- Do not work directly on `main`.
- Create a separate branch for each feature.
- Pull the latest `main` before starting new work.
- Test your changes before opening a Pull Request.
- Do not commit passwords, JWT secrets, or environment files.

## 9. Project Documentation

Additional documentation is available in the `docs/` directory:

- [Requirements Specification](docs/requirements.md)
- [UML Class Diagram](docs/diagrams/class-diagram.puml)
- [System Architecture](docs/diagrams/architecture.puml)
- [Database ERD](docs/diagrams/database-erd.puml)

---

**CloudOps Manager** — Cloud Infrastructure Management Project.
