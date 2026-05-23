# PulseVote

**PulseVote** es una plataforma web full-stack de encuestas en tiempo real. Permite que administradores creen, editen y gestionen encuestas, mientras que usuarios pueden votar una sola vez por encuesta. Los resultados se visualizan en un dashboard con actualización automática mediante polling.

El proyecto fue desarrollado como prueba técnica full-stack, priorizando arquitectura clara, autenticación segura, roles, validaciones, experiencia de usuario, documentación y facilidad de ejecución local.

> Repositorio: [github.com/Juanitowski-8/PulseVote](https://github.com/Juanitowski-8/PulseVote)

---

## Tabla de contenido

- [Descripción general](#descripción-general)
- [Funcionalidades principales](#funcionalidades-principales)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Modelo de datos](#modelo-de-datos)
- [Requisitos previos](#requisitos-previos)
- [Cómo correr el proyecto localmente](#cómo-correr-el-proyecto-localmente)
- [Usuarios de prueba](#usuarios-de-prueba)
- [URLs útiles](#urls-útiles)
- [Variables de entorno](#variables-de-entorno)
- [Endpoints principales](#endpoints-principales)
- [Tests](#tests)
- [Decisiones técnicas](#decisiones-técnicas)
- [Trade-offs y mejoras futuras](#trade-offs-y-mejoras-futuras)
- [Uso de IA](#uso-de-ia)
- [Checklist de prueba manual](#checklist-de-prueba-manual)
- [Troubleshooting](#troubleshooting)
- [Documentación adicional](#documentación-adicional)
- [Estado del proyecto](#estado-del-proyecto)
- [Autor](#autor)

---

## Descripción general

PulseVote resuelve un flujo completo de encuestas en tiempo real:

1. Un administrador inicia sesión.
2. El administrador crea encuestas con múltiples opciones.
3. Los usuarios inician sesión y votan en encuestas activas.
4. Cada usuario solo puede votar una vez por encuesta.
5. El dashboard muestra métricas y resultados actualizándose automáticamente sin recargar la página.

La aplicación está dividida en dos partes principales:

```text
/backend   API REST con Express, TypeScript, Prisma y PostgreSQL
/frontend  Aplicación React con TypeScript, Vite, Tailwind CSS y Recharts
```

---

## Funcionalidades principales

### Autenticación y autorización

- Login con JWT.
- Roles:
  - `ADMIN`: puede crear, editar, eliminar y listar encuestas.
  - `USER`: puede ver encuestas activas y votar.
- Rutas protegidas en backend y frontend.
- Restauración de sesión mediante `GET /api/auth/me`.

### Encuestas

- Crear encuestas con pregunta, descripción y múltiples opciones.
- Editar, eliminar y activar/desactivar encuestas.
- Listar encuestas según el rol.
- Consultar resultados por encuesta.

### Votación

- Los usuarios votan en encuestas activas.
- Un usuario no puede votar dos veces en la misma encuesta.
- Validación en backend y restricción en base de datos:

```prisma
@@unique([userId, pollId])
```

### Dashboard

- Métricas generales y resultados por encuesta.
- Gráficas con Recharts.
- Polling cada 3 segundos.
- Estados de carga, error y vacío.

### UI/UX

- Diseño responsive.
- Modo claro y oscuro con persistencia en `localStorage`.
- Paleta premium verde, landing con fondo animado.
- Code splitting por rutas (Vite).
- Estados visuales: loading, error, empty state, feedback.

### Documentación

- Swagger/OpenAPI en `/api/docs`.
- README completo y guías en `/docs`.

---

## Stack tecnológico

### Frontend

- React · TypeScript · Vite
- Tailwind CSS · Recharts · React Router DOM
- Lucide React · Vitest · React Testing Library

### Backend

- Node.js · Express · TypeScript
- Prisma ORM · PostgreSQL
- JWT · bcrypt · Zod · Swagger/OpenAPI
- Supertest · Vitest

### Infraestructura local

- Docker · Docker Compose (PostgreSQL)

---

## Arquitectura

### Backend

```text
backend/
  prisma/
  src/
    config/
    controllers/
    middlewares/
    routes/
    schemas/
    services/
    types/
    utils/
    app.ts
    server.ts
```

```text
Request → Route → Middlewares → Controller → Service → Prisma → Response
```

### Frontend

```text
frontend/
  src/
    components/
    context/
    hooks/
    layouts/
    pages/
    routes/
    services/
    types/
    utils/
```

```text
Page → Components → Hooks/Context → Services → API
```

---

## Modelo de datos

### User

- `id`, `name`, `email`, `passwordHash`, `role`, timestamps  
- Roles: `ADMIN` | `USER`

### Poll

- `id`, `question`, `description`, `isActive`, `createdById`, timestamps

### PollOption

- `id`, `text`, `pollId`, timestamps

### Vote

- `id`, `userId`, `pollId`, `optionId`, `createdAt`
- `@@unique([userId, pollId])` — voto único garantizado en BD

---

## Requisitos previos

- Node.js >= 18
- npm >= 9
- Docker Desktop
- Git

Puertos libres: **3000** (API), **5173** (frontend, fijo), **5433** (PostgreSQL en Docker)

---

## Cómo correr el proyecto localmente

Necesitas **tres servicios** activos:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| PostgreSQL | 5433 | Docker Compose |
| Backend API | 3000 | Express + Prisma |
| Frontend | 5173 | React + Vite (`strictPort: true`) |

> Docker solo levanta la base de datos. Backend y frontend corren en terminales separadas.

### 1. Clonar el repositorio

```bash
git clone https://github.com/Juanitowski-8/PulseVote.git
cd PulseVote
```

**Opcional — desde la raíz (monorepo con npm workspaces):**

```bash
npm install
npm run db:setup
npm run build
```

| Comando | Descripción |
|---------|-------------|
| `npm run dev:backend` | API en http://localhost:3000 |
| `npm run dev:frontend` | App en http://localhost:5173 |
| `npm run test` | Tests frontend + backend |
| `npm run build` | Build de ambos paquetes |

### 2. Levantar PostgreSQL

```bash
docker compose up -d
docker ps
```

PostgreSQL en **localhost:5433** (`5433:5432`) para no chocar con Postgres local en 5432.

### 3. Backend

```bash
cd backend
```

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**Linux / macOS:**

```bash
cp .env.example .env
```

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Verificar: http://localhost:3000/api/health

```json
{ "status": "ok", "service": "pulsevote-api" }
```

> No cierres esta terminal.

### 4. Frontend

En **otra terminal**:

```bash
cd frontend
```

```powershell
# Windows
Copy-Item .env.example .env
```

```bash
# Linux / macOS
cp .env.example .env
```

```bash
npm install
npm run dev
```

Abrir: **http://localhost:5173**

> Vite usa puerto fijo 5173. Si está ocupado, libera el puerto (ver [Troubleshooting](#troubleshooting)).

---

## Usuarios de prueba

### Administrador

```text
Email: admin@pulsevote.app
Password: Admin123!
```

### Usuario

```text
Email: user@pulsevote.app
Password: User123!
```

---

## URLs útiles

| Recurso | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| Health | http://localhost:3000/api/health |
| Swagger | http://localhost:3000/api/docs |

---

## Variables de entorno

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://pulsevote_user:pulsevote_password@localhost:5433/pulsevote?schema=public
JWT_SECRET=change_me_to_a_long_random_secret
JWT_EXPIRES_IN=24h
PORT=3000
FRONTEND_URL=http://localhost:5173
# Opcional: FRONTEND_URLS=http://localhost:5173,http://localhost:5174
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCKS=false
```

---

## Endpoints principales

### Formato de respuesta

Éxito:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "error": { "code": "ERROR_CODE", "message": "Error message" }
}
```

### Auth

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Usuario autenticado |

### Polls

| Método | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| GET | `/api/polls` | ADMIN / USER | Listar |
| GET | `/api/polls/:id` | ADMIN / USER | Detalle |
| POST | `/api/polls` | ADMIN | Crear |
| PUT | `/api/polls/:id` | ADMIN | Editar |
| DELETE | `/api/polls/:id` | ADMIN | Eliminar |
| GET | `/api/polls/:id/results` | ADMIN / USER | Resultados |

### Votes

| Método | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| POST | `/api/polls/:id/vote` | USER | Votar |

### Dashboard

| Método | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| GET | `/api/dashboard/summary` | ADMIN | Métricas |
| GET | `/api/dashboard/polls/:id/results` | ADMIN | Resultados para gráficas |

### Health

| Método | Endpoint |
|--------|----------|
| GET | `/api/health` |

### Swagger

1. Login en `/api/docs`
2. Copiar JWT
3. **Authorize** → `Bearer <token>`
4. Probar endpoints protegidos

---

## Tests

### Backend

Requiere PostgreSQL activo con migrate + seed.

```bash
docker compose up -d
cd backend
npm run prisma:migrate
npm run prisma:seed
npm run test
```

Cubre: health, auth, roles, CRUD polls, voto, voto duplicado (409).

### Frontend

```bash
cd frontend
npm run test
```

Cubre: login, componentes, rutas protegidas, theme toggle.

### Builds

```bash
# Desde la raíz
npm run build

# O por paquete
cd backend && npm run build
cd frontend && npm run build
```

---

## Decisiones técnicas

- **Node.js + Express + TypeScript** — desarrollo ágil y código tipado.
- **Prisma** — migraciones y cliente tipado.
- **PostgreSQL** — relaciones y restricción única de votos.
- **JWT** — auth stateless con roles en token.
- **Zod** — validación de entrada en backend.
- **Polling 3s** — tiempo real sin WebSockets (simple y estable).
- **Voto único** — servicio + `@@unique([userId, pollId])`.
- **Code splitting** — rutas lazy y chunk de Recharts separado.
- **Tema claro/oscuro** — CSS variables + clase `.dark` en `<html>`.

---

## Trade-offs y mejoras futuras

### Trade-offs

- Polling en lugar de WebSocket.
- JWT sin refresh tokens.
- Docker solo para PostgreSQL; FE/BE con npm.
- Tests de integración/unitarios, sin E2E completo.

### Mejoras futuras

- WebSocket o SSE.
- Refresh tokens.
- E2E (Playwright).
- CI/CD y deploy (Vercel + Render/Railway).
- Export CSV, filtros avanzados, auditoría.

---

## Uso de IA

IA como apoyo para estructura, componentes, validaciones, documentación y diseño. Código revisado, probado con builds y tests. Preparado para explicar decisiones en entrevista.

---

## Checklist de prueba manual

### Setup

- [ ] `docker compose up -d`
- [ ] Migraciones + seed
- [ ] Backend en :3000
- [ ] `/api/health` OK
- [ ] Frontend en :5173

### Admin

- [ ] Login admin
- [ ] CRUD encuestas
- [ ] Dashboard y gráficas
- [ ] Logout

### User

- [ ] Login user
- [ ] Votar una vez
- [ ] Segundo voto → error
- [ ] Resultados

### Seguridad

- [ ] Sin token → 401
- [ ] User no crea polls
- [ ] Admin no vota (si aplica)

### UI

- [ ] Modo claro / oscuro
- [ ] Polling sin recargar página

---

## Troubleshooting

### `ERR_CONNECTION_REFUSED` en `localhost:3000`

```bash
cd backend
npm run dev
```

### `Port 5173 is already in use`

Vite no cambia a 5174 (`strictPort: true`). Libera el puerto:

```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

O cierra la terminal anterior de Vite (`Ctrl + C`).

### Error de CORS

- Frontend en **http://localhost:5173**
- `FRONTEND_URL=http://localhost:5173` en `backend/.env`
- Reinicia el backend

### Error de base de datos

```bash
docker compose up -d
cd backend
npm run prisma:migrate
npm run prisma:seed
```

### Frontend sin datos

Verifica http://localhost:3000/api/health y que `VITE_USE_MOCKS=false`.

---

## Documentación adicional

| Archivo | Contenido |
|---------|-----------|
| [docs/GUIA-ENTREVISTA.md](docs/GUIA-ENTREVISTA.md) | Guía para presentar el proyecto |
| [docs/CHECKLIST-ENTREGA.md](docs/CHECKLIST-ENTREGA.md) | Checklist de entrega |
| [docs/ESTADO-SISTEMA.md](docs/ESTADO-SISTEMA.md) | Estado técnico |
| [backend/README.md](backend/README.md) | Detalle del API |

---

## Estado del proyecto

- API REST con envelope estándar
- JWT + roles
- CRUD encuestas + voto único
- Dashboard con polling
- Swagger, migraciones, seed
- Frontend React + tema claro/oscuro
- Tests backend (9) y frontend (10)
- README y guías de documentación

---

## Autor

Desarrollado por **Juan**.

**PulseVote** · [github.com/Juanitowski-8/PulseVote](https://github.com/Juanitowski-8/PulseVote)
