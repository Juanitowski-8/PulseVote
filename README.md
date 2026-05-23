# PulseVote

Plataforma de encuestas en tiempo real (React + Express + PostgreSQL + Prisma).

- **Estado del sistema:** [docs/ESTADO-SISTEMA.md](docs/ESTADO-SISTEMA.md)
- **Checklist de entrega técnica:** [docs/CHECKLIST-ENTREGA.md](docs/CHECKLIST-ENTREGA.md)
- **Repositorio:** https://github.com/Juanitowski-8/PulseVote

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React, TypeScript, Vite, Tailwind |
| Backend | Node.js, Express, Prisma |
| Base de datos | PostgreSQL (Docker, puerto **5433**) |
| API docs | Swagger en `/api/docs` |

## Inicio rápido (Windows / PowerShell)

### 1. PostgreSQL

```powershell
cd C:\ruta\a\PulseVote
docker compose up -d
```

### 2. Backend

```powershell
cd backend
copy .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

API: http://localhost:3000 · Health: http://localhost:3000/api/health · Swagger: http://localhost:3000/api/docs

### 3. Frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

App: http://localhost:5173

En `frontend/.env` usar backend real:

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCKS=false
```

## Variables de entorno

**Backend** (`backend/.env.example`):

| Variable | Ejemplo |
|----------|---------|
| `DATABASE_URL` | `postgresql://pulsevote_user:pulsevote_password@localhost:5433/pulsevote?schema=public` |
| `JWT_SECRET` | cadena larga aleatoria (≥16 caracteres) |
| `JWT_EXPIRES_IN` | `24h` |
| `PORT` | `3000` |
| `FRONTEND_URL` | `http://localhost:5173` |

**Frontend** (`frontend/.env.example`):

| Variable | Ejemplo |
|----------|---------|
| `VITE_API_URL` | `http://localhost:3000/api` |
| `VITE_USE_MOCKS` | `false` |

> Los archivos `.env` están en `.gitignore` y no deben subirse al repositorio.

## Build de producción

```powershell
cd backend
npm run build

cd ..\frontend
npm run build
```

## Usuarios de prueba (seed)

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@pulsevote.app | Admin123! |
| User | user@pulsevote.app | User123! |

## Funcionalidades

- Autenticación JWT y roles **ADMIN** / **USER**
- CRUD de encuestas (solo admin)
- Voto único por usuario y encuesta
- Dashboard con métricas y resultados en vivo (polling ~3 s)
- Documentación OpenAPI interactiva

## Entrega técnica

Sigue paso a paso [docs/CHECKLIST-ENTREGA.md](docs/CHECKLIST-ENTREGA.md) para validar login, encuestas, votos, roles, errores y diseño antes de la demo.
