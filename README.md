# UITOP Todo

Initial project setup for the UITOP full-stack test task.

## Structure

```
frontend/   Vite + React + TypeScript + MUI
backend/    NestJS + SQLite + Swagger
```

## Prerequisites

- Node.js 22+
- npm
- Docker & Docker Compose (optional)

## Setup

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run start:dev

# Frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api

## Docker

```bash
docker compose up --build
```

## Tests

```bash
cd backend && npm test && npm run test:e2e
cd frontend && npm test
```

## Installed libraries

**Frontend:** MUI, React Hook Form, Axios, Vitest, React Testing Library

**Backend:** TypeORM, SQLite, Swagger, class-validator, Jest

Feature implementation (todos, categories, undo snackbar) is not included in this init commit.
