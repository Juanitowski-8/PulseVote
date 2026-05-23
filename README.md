<p align="center">
  <img src="docs/assets/pulsevote-logo.svg" width="96" height="96" alt="PulseVote logo" />
</p>

<h1 align="center">PulseVote</h1>

<p align="center">
  <strong>Encuestas en tiempo real</strong> · privadas para quien crea · abiertas para quien participa
</p>

<p align="center">
  <a href="https://github.com/Juanitowski-8/PulseVote">Repositorio</a>
  ·
  <a href="#inicio-rápido">Inicio rápido</a>
  ·
  <a href="#roles-privacidad-y-registro">Roles</a>
  ·
  <a href="http://localhost:3000/api/docs">Swagger</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-Roles-00F58A?style=flat&labelColor=1a1f1c" alt="JWT" />
</p>

---

## ¿Qué es PulseVote?

**PulseVote** es una plataforma full-stack para crear encuestas, recoger votos de forma segura y visualizar resultados en un **dashboard en vivo** (polling cada 3 s). Pensada para equipos que necesitan decidir con datos, sin mezclar encuestas entre administradores.

| Para quién | Qué obtiene |
|------------|-------------|
| **Organizador (ADMIN)** | Sus propias encuestas, métricas y resultados — nadie más ve lo que no creó |
| **Participante (USER)** | Todas las encuestas publicadas, voto único y registro propio |
| **Equipo técnico** | API REST documentada, tests, Docker y monorepo listo para demo o entrevista |

> Repositorio: [github.com/Juanitowski-8/PulseVote](https://github.com/Juanitowski-8/PulseVote)

---

## Inicio rápido

```bash
# Terminal 1 — base de datos
docker compose up -d

# Terminal 2 — API (desde la raíz)
npm run db:setup
npm run dev:backend

# Terminal 3 — frontend
npm run dev:frontend
```

| Paso | URL / acción |
|------|----------------|
| App | http://localhost:5173 |
| Crear cuenta | http://localhost:5173/register |
| Admin demo | `admin@pulsevote.app` / `Admin123!` |
| API health | http://localhost:3000/api/health |

---

## Roles, privacidad y registro

El corazón del producto es **quién ve qué** y **cómo se guardan los votos** en base de datos.

### Registro público (`USER`)

Cualquier persona puede **crear cuenta** en `/register` (o `POST /api/auth/register`):

- Rol asignado: `USER`
- Email único (409 si ya existe)
- Tras registrarse: JWT + sesión, igual que en login
- Sus votos quedan ligados a `userId` en PostgreSQL (`Vote.userId`)

### Administrador (`ADMIN`)

- Cuentas de organización (seed o asignación manual), no se crean por el registro público
- **Solo ve y gestiona encuestas que él mismo creó** (`Poll.createdById`)
- Dashboard, edición, borrado y resultados del dashboard: **scoped al admin autenticado**
- Si intenta acceder a una encuesta de otro admin → `403 FORBIDDEN`

### Participante (`USER`)

- **Ve todas las encuestas** del sistema (activas e inactivas)
- **Vota solo en encuestas activas**, una vez por encuesta
- Encuestas cerradas: visibles, botón “Encuesta cerrada” (sin voto)

### Comparativa visual

| Acción | ADMIN | USER |
|--------|:-----:|:----:|
| Registrarse en `/register` | — | ✅ |
| Crear / editar / borrar encuestas | ✅ solo las suyas | — |
| Listar encuestas | Solo las propias | Todas |
| Votar | — | ✅ (activas) |
| Dashboard analítico | ✅ solo sus métricas | — |
| Voto único en BD | — | ✅ `@@unique([userId, pollId])` |

### Flujo del sistema

```mermaid
flowchart LR
  subgraph Admin
    A1[Login ADMIN] --> A2[Crear encuesta]
    A2 --> A3[Gestiona solo createdById = su id]
    A3 --> A4[Dashboard y resultados propios]
  end

  subgraph Participante
    U1[Register o Login USER] --> U2[Ve todas las polls]
    U2 --> U3{Vota en activa?}
    U3 -->|Sí, 1 vez| U4[Vote guardado con userId]
    U3 -->|Inactiva| U5[Solo lectura]
  end

  A2 -. publica .-> U2
```

---

## Funcionalidades destacadas

<table>
<tr>
<td width="50%">

### Autenticación

- Login JWT + `GET /api/auth/me`
- **Registro** de participantes
- Rutas protegidas (FE + BE)
- Roles `ADMIN` | `USER`

</td>
<td width="50%">

### Encuestas y votos

- CRUD de encuestas (admin, scope propio)
- Activar / desactivar
- Voto único garantizado en BD
- Resultados y gráficas Recharts

</td>
</tr>
<tr>
<td>

### Experiencia

- Landing premium + tema claro/oscuro
- Code splitting (Vite)
- Estados loading / error / empty
- Responsive

</td>
<td>

### Developer experience

- Swagger en `/api/docs`
- Monorepo npm workspaces
- Tests backend + frontend
- Docker solo para Postgres

</td>
</tr>
</table>

---

## Tabla de contenido

- [¿Qué es PulseVote?](#qué-es-pulsevote)
- [Inicio rápido](#inicio-rápido)
- [Roles, privacidad y registro](#roles-privacidad-y-registro)
- [Funcionalidades destacadas](#funcionalidades-destacadas)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Modelo de datos](#modelo-de-datos)
- [Requisitos previos](#requisitos-previos)
- [Cómo correr el proyecto](#cómo-correr-el-proyecto-localmente)
- [Usuarios de prueba](#usuarios-de-prueba)
- [URLs útiles](#urls-útiles)
- [Variables de entorno](#variables-de-entorno)
- [Endpoints principales](#endpoints-principales)
- [Tests](#tests)
- [Decisiones técnicas](#decisiones-técnicas)
- [Trade-offs y mejoras futuras](#trade-offs-y-mejoras-futuras)
- [Checklist de prueba manual](#checklist-de-prueba-manual)
- [Troubleshooting](#troubleshooting)
- [Documentación adicional](#documentación-adicional)
- [Estado del proyecto](#estado-del-proyecto)
- [Autor](#autor)

---

## Stack tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | React · TypeScript · Vite · Tailwind · Recharts · React Router |
| **Backend** | Node.js · Express · TypeScript · Prisma · PostgreSQL |
| **Auth** | JWT · bcrypt · Zod |
| **Docs / QA** | Swagger · Vitest · Supertest · RTL |
| **Local** | Docker Compose (PostgreSQL) |

---

## Arquitectura

```text
/backend   API REST — Express, Prisma, PostgreSQL
/frontend  SPA — React, Vite, Tailwind
```

**Backend:** `Request → Route → Middlewares → Controller → Service → Prisma → Response`

**Frontend:** `Page → Components → Hooks/Context → Services → API`

```text
backend/src/     config · controllers · middlewares · routes · schemas · services
frontend/src/    components · context · hooks · pages · routes · services
```

---

## Modelo de datos

| Entidad | Campos clave | Notas |
|---------|--------------|--------|
| **User** | `email`, `passwordHash`, `role` | `ADMIN` \| `USER` |
| **Poll** | `question`, `isActive`, **`createdById`** | Dueño de la encuesta (admin) |
| **PollOption** | `text`, `pollId` | Opciones de respuesta |
| **Vote** | `userId`, `pollId`, `optionId` | `@@unique([userId, pollId])` |

---

## Requisitos previos

- Node.js **≥ 18** · npm **≥ 9** · Docker Desktop · Git
- Puertos libres: **3000** (API) · **5173** (frontend) · **5433** (Postgres en Docker)

---

## Cómo correr el proyecto localmente

| Servicio | Puerto | Cómo |
|----------|--------|------|
| PostgreSQL | 5433 | `docker compose up -d` |
| Backend | 3000 | `npm run dev:backend` |
| Frontend | 5173 | `npm run dev:frontend` |

### 1. Clonar e instalar (opcional monorepo)

```bash
git clone https://github.com/Juanitowski-8/PulseVote.git
cd PulseVote
npm install
npm run db:setup
npm run build
```

| Comando raíz | Descripción |
|--------------|-------------|
| `npm run dev:backend` | API |
| `npm run dev:frontend` | App React |
| `npm run test` | Tests FE + BE |
| `npm run build` | Build producción |

### 2. PostgreSQL

```bash
docker compose up -d
```

### 3. Backend

```bash
cd backend
cp .env.example .env   # Windows: Copy-Item .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Comprobar: http://localhost:3000/api/health → `{ "status": "ok", "service": "pulsevote-api" }`

### 4. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Abrir **http://localhost:5173** · registro en **/register**

---

## Usuarios de prueba

| Rol | Email | Contraseña | Uso |
|-----|-------|------------|-----|
| **Admin** | `admin@pulsevote.app` | `Admin123!` | Crear encuestas, dashboard |
| **Usuario** | `user@pulsevote.app` | `User123!` | Ver todas y votar |
| **Nuevo** | — | — | Registro en `/register` (mín. 8 caracteres) |

---

## URLs útiles

| Recurso | URL |
|---------|-----|
| Landing / App | http://localhost:5173 |
| Registro | http://localhost:5173/register |
| Login | http://localhost:5173/login |
| API | http://localhost:3000/api |
| Health | http://localhost:3000/api/health |
| Swagger | http://localhost:3000/api/docs |

---

## Variables de entorno

**Backend** (`backend/.env`):

```env
DATABASE_URL=postgresql://pulsevote_user:pulsevote_password@localhost:5433/pulsevote?schema=public
JWT_SECRET=change_me_to_a_long_random_secret
JWT_EXPIRES_IN=24h
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCKS=false
```

---

## Endpoints principales

### Auth

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Crear cuenta `USER` |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Perfil autenticado |

### Polls (comportamiento por rol)

| Método | Endpoint | ADMIN | USER |
|--------|----------|-------|------|
| GET | `/api/polls` | Solo `createdById = yo` | **Todas** |
| GET | `/api/polls/:id` | Solo propias | Cualquiera |
| POST | `/api/polls` | Crear (asigna `createdById`) | 403 |
| PUT / DELETE | `/api/polls/:id` | Solo propias | 403 |
| GET | `/api/polls/:id/results` | Solo propias | Según reglas de voto |

### Votes

| Método | Endpoint | Rol |
|--------|----------|-----|
| POST | `/api/polls/:id/vote` | USER (encuesta activa, 1 voto) |

### Dashboard

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Métricas del admin **solo de sus encuestas** |
| GET | `/api/dashboard/polls/:id/results` | Resultados si la encuesta es del admin |

### Formato de respuesta

```json
{ "success": true, "message": "...", "data": {} }
```

```json
{ "success": false, "message": "...", "error": { "code": "ERROR_CODE", "message": "..." } }
```

**Swagger:** login → copiar JWT → **Authorize** → `Bearer <token>`

---

## Tests

```bash
# Backend (PostgreSQL + migrate + seed)
docker compose up -d
cd backend && npm run test

# Frontend
cd frontend && npm run test

# Todo desde la raíz
npm run test
```

| Suite | Cubre |
|-------|--------|
| **Backend** | health, register, login, **scope admin en polls**, user ve todas, CRUD, voto, 409 duplicado |
| **Frontend** | rutas protegidas, login, theme, componentes |

---

## Decisiones técnicas

- **Scope por `createdById`** — privacidad multi-admin sin tablas extra
- **USER ve todo, vota en activas** — participación abierta, control en `isActive`
- **Registro público solo `USER`** — superficie de ataque reducida para admins
- **Voto único** — servicio + `@@unique([userId, pollId])`
- **JWT + roles** — stateless, simple de demostrar
- **Polling 3 s** — dashboard en vivo sin WebSockets
- **Tema claro/oscuro** — variables CSS + `localStorage`

---

## Trade-offs y mejoras futuras

| Hoy | Posible evolución |
|-----|-------------------|
| Polling | WebSocket / SSE |
| JWT sin refresh | Refresh tokens |
| Admins vía seed | Invitaciones / panel de roles |
| Tests unitarios + integración | E2E Playwright |
| Deploy manual | CI/CD + Vercel + Railway |

---

## Checklist de prueba manual

### Setup

- [ ] `docker compose up -d` + migrate + seed
- [ ] Backend `:3000` · Frontend `:5173`

### Admin (privacidad)

- [ ] Login admin → solo aparecen **sus** encuestas
- [ ] Crear encuesta → `createdById` correcto
- [ ] Dashboard solo con métricas propias
- [ ] No puede votar (403)

### Usuario

- [ ] **Registro** en `/register` → entra a `/user/polls`
- [ ] Ve **todas** las encuestas (activas + cerradas)
- [ ] Vota en activa una vez → 409 al repetir
- [ ] Cerrada → no vota, solo lectura

### UI

- [ ] Tema claro / oscuro
- [ ] Polling en dashboard sin recargar

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| `ERR_CONNECTION_REFUSED :3000` | `cd backend && npm run dev` |
| Puerto 5173 ocupado | Cerrar Vite anterior o liberar PID (`strictPort: true`) |
| CORS | `FRONTEND_URL=http://localhost:5173` y reiniciar API |
| Sin datos | `VITE_USE_MOCKS=false` y `/api/health` OK |
| BD | `docker compose up -d` + `npm run prisma:migrate` + seed |

---

## Documentación adicional

| Archivo | Contenido |
|---------|-----------|
| [docs/GUIA-ENTREVISTA.md](docs/GUIA-ENTREVISTA.md) | Presentar el proyecto |
| [docs/CHECKLIST-ENTREGA.md](docs/CHECKLIST-ENTREGA.md) | Entrega |
| [docs/ESTADO-SISTEMA.md](docs/ESTADO-SISTEMA.md) | Estado técnico |
| [backend/README.md](backend/README.md) | Detalle API |

---

## Estado del proyecto

- Registro de usuarios + login JWT
- **Encuestas aisladas por admin** (`createdById`)
- **Usuarios ven todas las encuestas** y votan con `userId` persistido
- Dashboard con polling · Swagger · tema claro/oscuro
- Tests backend (14) · frontend (10)
- README visual + logo en `docs/assets/`

---

<p align="center">
  <img src="docs/assets/pulsevote-logo.svg" width="48" height="48" alt="PulseVote" />
  <br />
  <strong>PulseVote</strong> · Desarrollado por <strong>Juan</strong>
  <br />
  <a href="https://github.com/Juanitowski-8/PulseVote">github.com/Juanitowski-8/PulseVote</a>
</p>
