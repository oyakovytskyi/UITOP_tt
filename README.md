# UITOP Todo

Full-stack todo app with categories for the UITOP test task.

## Live demo

- **App:** [https://uitop-tt.vercel.app/](https://uitop-tt.vercel.app/)
- **API:** [https://uitop-tt.onrender.com](https://uitop-tt.onrender.com)
- **Swagger:** [https://uitop-tt.onrender.com/api](https://uitop-tt.onrender.com/api)
- **Repository:** [https://github.com/oyakovytskyi/UITOP_tt](https://github.com/oyakovytskyi/UITOP_tt)

## Features

- Create tasks with text and category
- Mark tasks as completed or delete them
- Filter tasks by category (or show all)
- Max 5 tasks per category (enforced by the backend)
- Undo snackbar after delete or complete (5 seconds)
- Loading, error, and empty states

## Structure

```
frontend/   Vite + React + TypeScript + MUI
backend/    NestJS + SQLite + Swagger
```

## Prerequisites

- Node.js 22+
- npm
- Docker & Docker Compose (optional)

## Local setup

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

## Deployment

**Frontend (Vercel):** set `VITE_API_BASE_URL=https://uitop-tt.onrender.com`

**Backend (Render):** set `CORS_ORIGIN=https://uitop-tt.vercel.app` and `DATABASE_PATH` to a persistent path if needed.

## Installed libraries

**Frontend:** MUI, React Hook Form, Axios, Vitest, React Testing Library

**Backend:** TypeORM, SQLite, Swagger, class-validator, Jest
