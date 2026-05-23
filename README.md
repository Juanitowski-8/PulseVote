<p align="center">
  <img src="docs/assets/pulsevote-logo.svg" width="96" height="96" alt="PulseVote logo" />
</p>

<h1 align="center">PulseVote</h1>

<p align="center">
  <strong>Prueba técnica full-stack</strong> — encuestas en tiempo real con roles, voto único y dashboard con polling
</p>

<p align="center">
  <a href="https://github.com/Juanitowski-8/PulseVote">Repositorio</a>
  ·
  <a href="#cómo-correr-el-proyecto-localmente">Cómo correr</a>
  ·
  <a href="#flujo-principal-para-probar">Flujo de prueba</a>
  ·
  <a href="#swagger-openapi">Swagger</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-Prisma-000000?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Docker-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
</p>

---

## ¿Qué es PulseVote?

**PulseVote** es una aplicación web full-stack para que administradores creen encuestas y usuarios participen con **un voto por encuesta**. Los resultados se actualizan en el dashboard mediante **polling cada 3 segundos** (sin recargar la página).

| Rol | Comportamiento real en el código |
|-----|----------------------------------|
| **ADMIN** | Crea encuestas; solo ve y gestiona las suyas (`createdById`); dashboard acotado a sus métricas |
| **USER** | Ve **todas** las encuestas; vota solo en **activas**; puede registrarse en `/register` |

> Repositorio: [github.com/Juanitowski-8/PulseVote](https://github.com/Juanitowski-8/PulseVote)

---

## Tabla de contenido

- [Requisitos previos](#requisitos-previos)
- [Cómo correr el proyecto localmente](#cómo-correr-el-proyecto-localmente)
- [Usuarios de prueba](#usuarios-de-prueba)
- [Estructura del código](#estructura-del-código)
- [Roles, privacidad y registro](#roles-privacidad-y-registro)
- [Flujo principal para probar](#flujo-principal-para-probar)
- [Casos límite y manejo de errores](#casos-límite-y-manejo-de-errores)
- [Swagger (OpenAPI)](#swagger-openapi)
- [URLs y variables de entorno](#urls-y-variables-de-entorno)
- [Endpoints principales](#endpoints-principales)
- [Tests y builds](#tests-y-builds)
- [Trade-offs y mejoras futuras](#trade-offs-y-mejoras-futuras)
- [Troubleshooting](#troubleshooting)
- [Documentación adicional](#documentación-adicional)
- [Estado del proyecto](#estado-del-proyecto)
- [Autor](#autor)

---

## Requisitos previos

| Requisito | Versión / nota |
|-----------|----------------|
| Node.js | ≥ 20 (ver `engines` en `package.json` raíz) |
| npm | ≥ 9 |
| Docker Desktop | Para PostgreSQL local |
| Git | Clonar el repositorio |
| Puertos libres | **5433**, **3000**, **5173** |

---

## Cómo correr el proyecto localmente

### Los 3 servicios que deben estar activos

PulseVote **no** es un solo comando: necesitas **tres procesos a la vez** mientras pruebas.

| Servicio | Puerto | Comando | Descripción |
|----------|--------|---------|-------------|
| **PostgreSQL** | **5433** | `docker compose up -d` | Base de datos (único servicio en Docker) |
| **Backend** | **3000** | `cd backend && npm run dev` | API REST Express + Prisma |
| **Frontend** | **5173** | `cd frontend && npm run dev` | App React (Vite, `strictPort: true`) |

**Importante:**

1. **Docker Compose solo levanta PostgreSQL.** No ejecuta el backend ni el frontend.
2. **Backend y frontend van en terminales separadas** (o en la raíz con `npm run dev:backend` / `npm run dev:frontend` si ya hiciste `npm install` en la raíz).
3. **No cierres esas terminales** mientras evalúas; si paras el backend o la BD, la app dejará de responder.

### Orden recomendado (paso a paso)

#### 1. Clonar

```bash
git clone https://github.com/Juanitowski-8/PulseVote.git
cd PulseVote
```

#### 2. Terminal A — PostgreSQL

```bash
docker compose up -d
docker ps   # debe aparecer el contenedor de Postgres
```

PostgreSQL queda en **localhost:5433** (mapeo `5433:5432` para no chocar con un Postgres local en 5432).

#### 3. Terminal B — Backend

```bash
cd backend
```

**Windows (PowerShell):** `Copy-Item .env.example .env`  
**Linux / macOS:** `cp .env.example .env`

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Comprobar: http://localhost:3000/api/health

```json
{ "status": "ok", "service": "pulsevote-api" }
```

> Deja esta terminal abierta.

#### 4. Terminal C — Frontend

```bash
cd frontend
cp .env.example .env    # Windows: Copy-Item .env.example .env
npm install
npm run dev
```

Abrir: **http://localhost:5173**

> Deja esta terminal abierta.

### Atajo desde la raíz (monorepo)

Tras `npm install` en la raíz del repo:

```bash
npm run db:setup          # generate + migrate + seed
npm run dev:backend       # terminal 1 — API :3000
npm run dev:frontend      # terminal 2 — App :5173
```

(Docker sigue siendo necesario en otra terminal: `docker compose up -d`.)

---

## Usuarios de prueba

Creados por el seed (`npm run prisma:seed`):

| Rol | Email | Contraseña |
|-----|-------|------------|
| **ADMIN** | `admin@pulsevote.app` | `Admin123!` |
| **USER** | `user@pulsevote.app` | `User123!` |

Además existe **registro público** en http://localhost:5173/register → rol `USER`, contraseña mínima 8 caracteres.

---

## Estructura del código

### Backend (`/backend`)

```text
backend/
├── prisma/
│   ├── schema.prisma      # Modelos y @@unique([userId, pollId])
│   ├── migrations/
│   └── seed.ts            # admin@pulsevote.app + user@pulsevote.app + encuestas demo
└── src/
    ├── config/            # env, prisma client, swagger
    ├── controllers/       # HTTP: parsean req, llaman services, envían respuesta
    ├── services/          # Lógica de negocio (auth, polls, votes, dashboard)
    ├── routes/            # Definición de rutas y middlewares por módulo
    ├── middlewares/       # auth JWT, validate (Zod), errores globales
    ├── schemas/           # Esquemas Zod de entrada (login, register, poll, vote)
    ├── types/             # Tipos TypeScript compartidos en el API
    ├── utils/             # JWT, password, AppError, envelope de respuesta
    ├── docs/              # Anotaciones Swagger (paths, schemas)
    ├── app.ts
    └── server.ts
```

**Flujo de una petición:**

```text
Request → Route → Middleware (auth / validate) → Controller → Service → Prisma → Database
                                                                              ↓
Response ← envelope { success, message?, data } ←─────────────────────────────┘
```

### Frontend (`/frontend`)

```text
frontend/
└── src/
    ├── components/        # UI reutilizable (polls, auth, dashboard, layout, ui)
    ├── pages/             # Pantallas (Welcome, Login, Register, Admin/User polls, Dashboard)
    ├── layouts/           # AppLayout, AuthLayout
    ├── routes/            # AppRoutes, ProtectedRoute (roles)
    ├── services/          # Llamadas HTTP (authService, pollService, api + interceptors)
    ├── hooks/             # useAuth, usePolls, usePolling, etc.
    ├── context/           # AuthContext, ThemeContext
    ├── types/             # Tipos TS alineados con el API
    ├── mocks/             # Datos locales si VITE_USE_MOCKS=true
    └── utils/
```

**Flujo en la interfaz:**

```text
Page → Components → Hooks / Context → Services (axios) → Backend API
```

---

## Roles, privacidad y registro

| Acción | ADMIN | USER |
|--------|:-----:|:----:|
| `POST /api/auth/register` | No (solo seed/manual) | Sí |
| Listar encuestas | Solo `createdById = su id` | **Todas** |
| Crear / editar / borrar encuesta | Solo propias | 403 |
| Votar | 403 | Sí, encuesta **activa**, 1 voto |
| Dashboard `/dashboard` | Sí (métricas propias) | No (ruta solo ADMIN) |

---

## Flujo principal para probar

Usa las credenciales del [seed](#usuarios-de-prueba). Con los **3 servicios activos** y http://localhost:5173 abierto:

### Como ADMIN

1. **Login** en http://localhost:5173/login con `admin@pulsevote.app` / `Admin123!`
2. Redirección a **Gestión de encuestas** (`/admin/polls`) — solo ves encuestas que **tú** creaste (en seed, las del admin demo).
3. **Dashboard** — menú lateral → `/dashboard`: métricas y gráficas de **tus** encuestas; actualización automática cada ~3 s.
4. **Crear encuesta** — botón “Nueva encuesta”: pregunta, opciones (mín. 2), activa/inactiva.
5. **Editar** — icono lápiz en una tarjeta; guardar cambios.
6. **Desactivar / activar** — icono Power; la encuesta deja de aceptar votos cuando está inactiva.
7. **Ver resultados** — icono gráfico en la tarjeta o desde el dashboard al elegir encuesta.
8. **Eliminar** — icono papelera (confirma en UI).
9. **Cerrar sesión** — botón en el sidebar.

### Como USER

1. **Login** en http://localhost:5173/login con `user@pulsevote.app` / `User123!`  
   *(Opcional: **Registro** en `/register` y repetir el flujo con cuenta nueva.)*
2. Redirección a **Todas las encuestas** (`/user/polls`) — listado de **todas** las encuestas (activas y cerradas).
3. **Votar** — en una encuesta **activa**, “Participar” → elegir opción → “Confirmar voto”.
4. **Confirmar voto único** — la tarjeta muestra “Ya votaste”; un segundo intento vía API devuelve **409** `ALREADY_VOTED`.
5. **Encuesta cerrada** — visible en la lista; botón “Encuesta cerrada” (no permite votar).
6. **Resultados** — tras votar, el backend devuelve resultados en la respuesta del voto; en UI verás confirmación y estado actualizado al refrescar la lista. *(El dashboard analítico completo es solo ADMIN.)*

### Comprobación rápida por API (opcional)

Con Swagger ([sección siguiente](#swagger-openapi)): login USER → `POST /api/polls/{id}/vote` dos veces → segunda respuesta **409**.

---

## Casos límite y manejo de errores

Todas las respuestas de error del API usan **envelope**:

```json
{
  "success": false,
  "message": "Texto legible",
  "error": { "code": "CODIGO", "message": "..." }
}
```

| Caso | Resultado esperado |
|------|-------------------|
| Sin token en ruta protegida (`GET /api/polls`, etc.) | **401** `UNAUTHORIZED`; en frontend, redirección a `/login` |
| **USER** intenta `POST /api/polls` | **403** `FORBIDDEN` |
| **ADMIN** intenta `POST /api/polls/:id/vote` | **403** `FORBIDDEN` |
| **USER** vota dos veces en la misma encuesta | **409** `ALREADY_VOTED` |
| Votar en encuesta **inactiva** | **400** `POLL_NOT_ACTIVE` |
| `optionId` que no pertenece a la encuesta | **400** `INVALID_OPTION` |
| Encuesta o recurso inexistente | **404** `POLL_NOT_FOUND` (u otro según endpoint) |
| **ADMIN** accede a encuesta de otro admin (detalle / editar / resultados dashboard) | **403** `FORBIDDEN` |
| Email duplicado en registro | **409** `EMAIL_ALREADY_EXISTS` |
| Body inválido (Zod) | **400** `VALIDATION_ERROR` |
| Formularios vacíos / email inválido (login, registro, encuesta) | Validación en **frontend** antes de enviar |
| Backend apagado (`ERR_CONNECTION_REFUSED`) | Mensaje de error en UI (axios) al cargar datos |
| PostgreSQL apagado o `DATABASE_URL` incorrecta | Error al arrancar API o **500** en peticiones; revisar Docker y migrate/seed |

### Voto único: doble protección

1. **Lógica de negocio** en `vote.service.ts`: comprueba si ya existe `Vote` para `(userId, pollId)` antes de crear.
2. **Base de datos** en `schema.prisma`:

```prisma
@@unique([userId, pollId])
```

Si dos peticiones llegan a la vez, Prisma puede lanzar `P2002` y el servicio lo traduce a **409** `ALREADY_VOTED`.

---

## Swagger (OpenAPI)

| | |
|---|---|
| **URL** | http://localhost:3000/api/docs |
| **Requisito** | Backend corriendo en `:3000` |

### Probar endpoints protegidos

1. Abre **http://localhost:3000/api/docs**.
2. Expande **`POST /auth/login`** → **Try it out**.
3. Body de ejemplo (admin):

```json
{
  "email": "admin@pulsevote.app",
  "password": "Admin123!"
}
```

4. **Execute** → en la respuesta, copia `data.token` del JSON (sin comillas extra).
5. Pulsa **Authorize** (candado arriba).
6. Escribe: `Bearer <tu_token>` (o solo el token si la UI lo añade sola).
7. Prueba rutas protegidas (`GET /polls`, `POST /polls`, etc.).

Los cuerpos de éxito siguen `{ "success": true, "message": "...", "data": { ... } }`.

---

## URLs y variables de entorno

| Recurso | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Login | http://localhost:5173/login |
| Registro | http://localhost:5173/register |
| API | http://localhost:3000/api |
| Health | http://localhost:3000/api/health |
| Swagger | http://localhost:3000/api/docs |

**`backend/.env`** (copiar desde `.env.example`):

```env
DATABASE_URL=postgresql://pulsevote_user:pulsevote_password@localhost:5433/pulsevote?schema=public
JWT_SECRET=change_me_to_a_long_random_secret
JWT_EXPIRES_IN=24h
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`**:

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCKS=false
```

Con `VITE_USE_MOCKS=true` la app usa datos en `localStorage` y **no** requiere backend (útil solo para UI aislada; para evaluar el full-stack déjalo en `false`).

---

## Endpoints principales

### Auth

| Método | Ruta | Notas |
|--------|------|--------|
| POST | `/api/auth/register` | Rol `USER` |
| POST | `/api/auth/login` | Devuelve `token` + `user` en `data` |
| GET | `/api/auth/me` | Requiere Bearer |

### Polls y votos

| Método | Ruta | ADMIN | USER |
|--------|------|-------|------|
| GET | `/api/polls` | Solo propias | Todas |
| POST | `/api/polls` | Crear | 403 |
| PUT/DELETE | `/api/polls/:id` | Solo propias | 403 |
| POST | `/api/polls/:id/vote` | 403 | Activa, 1 voto |
| GET | `/api/polls/:id/results` | Solo propias | Reglas de rol/voto |

### Dashboard (solo ADMIN)

| Método | Ruta |
|--------|------|
| GET | `/api/dashboard/summary` |
| GET | `/api/dashboard/polls/:id/results` |

---

## Tests y builds

Existen **tests automatizados** (Vitest). No es solo prueba manual.

### Backend

Requiere **PostgreSQL** con migrate + seed.

```bash
docker compose up -d
cd backend
npm run prisma:migrate
npm run prisma:seed
npm run test
```

Cubre entre otros: health, register, login, listado admin acotado, user ve todas las polls, CRUD, voto, 409 duplicado, 403 por rol.

```bash
cd backend
npm run build
```

### Frontend

```bash
cd frontend
npm run test
npm run build
```

Cubre: rutas protegidas, componentes de auth, theme toggle, etc.

### Desde la raíz

```bash
npm run test          # frontend + backend
npm run build         # build de ambos workspaces
```

---

## Trade-offs y mejoras futuras

Cada decisión prioriza **entregar la prueba técnica de forma estable y explicable**, no producción a escala.

### Polling cada 3 segundos (en lugar de WebSocket)

- **Por qué:** Cumple el requisito de actualización automática del dashboard sin recargar la página, con arquitectura simple y sin gestionar conexiones persistentes.
- **Mejora futura:** WebSocket o SSE para menor latencia y menos tráfico HTTP repetido.

### JWT simple sin refresh tokens

- **Por qué:** Autenticación stateless fácil de demostrar en Swagger y en el frontend; menos superficie que un flujo refresh + rotación.
- **Mejora futura:** Refresh tokens, expiración corta del access token y revocación en logout.

### Docker Compose solo para PostgreSQL

- **Por qué:** La evaluación local suele asumir `npm run dev` en FE/BE; Docker reduce fricción solo en la BD.
- **Mejora futura:** `docker compose` con servicios API y frontend, o imagen única para demo.

### Tests automatizados básicos (sin E2E completo)

- **Por qué:** Tests de integración (Supertest) y unitarios (RTL) validan contratos y reglas críticas (roles, 409, scope admin) con poco mantenimiento.
- **Mejora futura:** E2E con Playwright (login → crear poll → votar → ver dashboard).

### Sin deploy productivo en este repositorio

- **Por qué:** Alcance acotado a prueba técnica local; no hay pipeline ni hosting documentado.
- **Mejora futura:** CI/CD, frontend en Vercel/Netlify, API en Render/Railway, Postgres gestionado.

### Backend y frontend ejecutados localmente con npm

- **Por qué:** Depuración directa, hot reload (Vite + tsx/nodemon) y alineación con el README de evaluación.
- **Mejora futura:** Scripts unificados o contenedores de desarrollo para onboarding en un solo comando (manteniendo claridad de los 3 servicios).

### Scope de encuestas por `createdById` (admin)

- **Por qué:** Privacidad entre administradores sin tablas de organización extra.
- **Mejora futura:** Organizaciones/equipos y permisos granulares.

---

## Troubleshooting

| Síntoma | Qué revisar |
|---------|-------------|
| **`ERR_CONNECTION_REFUSED` en `localhost:3000`** | Backend no está corriendo → `cd backend && npm run dev` y comprobar `/api/health`. |
| **`Port 5173 is already in use`** | Vite usa `strictPort: true` y no cambia de puerto. Cierra la terminal anterior de Vite o libera el PID (Windows: `netstat -ano \| findstr :5173` → `taskkill /PID <pid> /F`). |
| **Error de CORS** | Frontend debe estar en **http://localhost:5173**; en `backend/.env`: `FRONTEND_URL=http://localhost:5173`; reinicia el backend. |
| **Error de base de datos / Prisma** | `docker compose up -d`; `cd backend && npm run prisma:migrate && npm run prisma:seed`; revisa `DATABASE_URL` (puerto **5433**). |
| **`Could not read package.json`** | Estás en una carpeta incorrecta. Usa la raíz del repo o `cd backend` / `cd frontend` según el comando. |
| **Frontend abre pero no hay datos** | `VITE_USE_MOCKS=false`; backend en :3000; `/api/health` OK; revisa consola del navegador (401 → login de nuevo). |
| **Login correcto pero 403 en todo** | Token viejo o rol incorrecto; logout y login con `admin@pulsevote.app` o `user@pulsevote.app`. |

---

## Documentación adicional

| Archivo | Contenido |
|---------|-----------|
| [docs/GUIA-ENTREVISTA.md](docs/GUIA-ENTREVISTA.md) | Guía para presentar el proyecto |
| [docs/CHECKLIST-ENTREGA.md](docs/CHECKLIST-ENTREGA.md) | Checklist de entrega |
| [docs/ESTADO-SISTEMA.md](docs/ESTADO-SISTEMA.md) | Estado técnico detallado |
| [backend/README.md](backend/README.md) | Notas del API |

---

## Estado del proyecto

- Monorepo npm (frontend + backend)
- Auth: login, registro `USER`, JWT, roles
- Encuestas con scope admin por `createdById`; usuarios ven todas
- Voto único (servicio + `@@unique`)
- Dashboard admin con polling ~3 s
- Swagger en `/api/docs`
- Tests: integración backend + unitarios frontend
- Tema claro/oscuro, landing, code splitting

**No incluido (mejoras futuras):** deploy productivo, WebSocket, refresh tokens, E2E Playwright.

---

## Autor

Desarrollado por **Juan Esteban Camargo Vergara** — prueba técnica **PulseVote**.

<p align="center">
  <img src="docs/assets/pulsevote-logo.svg" width="48" height="48" alt="PulseVote" />
  <br />
  <strong>PulseVote</strong> · Desarrollado por <strong>Juan Esteban Camargo Vergara</strong>
  <br />
  <a href="https://github.com/Juanitowski-8/PulseVote">github.com/Juanitowski-8/PulseVote</a>
</p>
