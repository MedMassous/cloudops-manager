# cloudops-manager

## Local development

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
npm run start:dev
```

The API is available at `http://localhost:3001/api`, Swagger at
`http://localhost:3001/docs`, and the health endpoint at
`http://localhost:3001/api/health`.

Docker Compose starts PostgreSQL, the backend, and the frontend:

```bash
docker compose up --build
```

Copy `backend/.env.example` to `backend/.env` and replace the development
JWT secret before running outside Compose.

## Project documentation

- [Requirements specification](docs/requirements.md)
- [UML class diagram (PlantUML)](docs/diagrams/class-diagram.puml)
- [System architecture (PlantUML)](docs/diagrams/architecture.puml)
- [Database ERD (PlantUML)](docs/diagrams/database-erd.puml)

The diagrams are editable PlantUML source files. They represent the proposed design and should be kept aligned with the implementation.
