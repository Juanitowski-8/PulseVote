# PulseVote

**Plataforma web full-stack de encuestas en tiempo real.**

Los administradores crean y gestionan encuestas. Los usuarios participan con **un voto por encuesta**. El **dashboard** muestra métricas y resultados que se actualizan automáticamente mediante **polling** cada 3 segundos.

> Prueba técnica full-stack · Repositorio: [github.com/Juanitowski-8/PulseVote](https://github.com/Juanitowski-8/PulseVote)

---

## Tabla de contenidos

- [Demo y flujo del producto](#demo-y-flujo-del-producto)
- [Funcionalidades](#funcionalidades)
- [Stack tecnológico](#stack-tecnológico)
- [Usuarios de prueba](#usuarios-de-prueba)
- [Arquitectura del monorepo](#arquitectura-del-monorepo)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Requisitos previos](#requisitos-previos)
- [Cómo correr el proyecto desde cero](#cómo-correr-el-proyecto-desde-cero)
- [Variables de entorno](#variables-de-entorno)
- [Endpoints principales](#endpoints-principales)
- [Decisiones técnicas](#decisiones-técnicas)
- [Trade-offs](#trade-offs)
- [Uso de IA](#uso-de-ia)
- [Pruebas manuales](#pruebas-manuales)
- [Mejoras futuras](#mejoras-futuras)
- [Documentación adicional](#documentación-adicional)
- [Autor](#autor)

---

## Demo y flujo del producto

1. **Landing** (`/`) — presentación del producto y acceso a login.
2. **Admin** inicia sesión → gestiona encuestas en `/admin/polls` (crear, editar, activar/desactivar, eliminar) y consulta el **dashboard** en `/dashboard`.
3. **Usuario** inicia sesión → ve encuestas **activas** en `/user/polls`, vota una vez y recibe confirmación o error si intenta repetir.
4. El **dashboard** refresca métricas y gráficos sin recargar la página (polling HTTP).

```text
  ADMIN                         USER
    │                             │
    ├─ CRUD encuestas             ├─ Ver activas
    ├─ Dashboard (métricas)       ├─ Votar (1 vez)
    └─ Resultados en vivo         └─ Estado "ya votaste"
```

---

## Funcionalidades

| Área | Detalle |
|------|---------|
| **Autenticación** | Login con JWT; sesión restaurada con `GET /auth/me`; logout en cliente |
| **Roles** | `ADMIN` y `USER`; rutas protegidas en frontend y middleware en backend |
| **Encuestas (ADMIN)** | Crear, listar, editar, eliminar; activar/desactivar |
| **Votación (USER)** | Voto sobre encuestas activas; validación de opción |
| **Voto único** | Restricción en aplicación + `@@unique([userId, pollId])` en PostgreSQL |
| **Dashboard** | Resumen de métricas y resultados por encuesta (Recharts) |
| **Tiempo real** | Polling cada **3 s** en dashboard (sin WebSocket) |
| **Validaciones** | Zod en backend; validación de formularios en frontend |
| **API docs** | Swagger/OpenAPI en `/api/docs` |
| **Base de datos** | PostgreSQL en Docker; Prisma migrate + seed |
| **UX** | Estados de carga, vacío y error; diseño oscuro premium; toggle día/noche en app |

---

## Stack tecnológico

### Frontend

- React · TypeScript · Vite  
- Tailwind CSS · Recharts · React Router DOM  
- Axios · Context API para auth y tema  

### Backend

- Node.js · Express · TypeScript  
- Prisma ORM · PostgreSQL  
- JWT · bcrypt · Zod  
- Swagger (swagger-jsdoc + swagger-ui-express)  

### Infraestructura local

- **Docker Compose** — PostgreSQL 16 en puerto **5433** (evita conflicto con instalaciones locales en 5432)

---

## Usuarios de prueba

Creados por `npm run prisma:seed`:

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | `admin@pulsevote.app` | `Admin123!` |
| **User** | `user@pulsevote.app` | `User123!` |

En la pantalla de login hay accesos rápidos para rellenar estas credenciales.

---

## Arquitectura del monorepo

```text
PulseVote/
├── backend/          # API REST (Express + Prisma)
├── frontend/         # SPA React (Vite)
├── docs/             # Estado del sistema y checklist de entrega
├── scripts/          # Helpers para levantar PostgreSQL (PowerShell/CMD)
├── docker-compose.yml
└── README.md
```

**Comunicación:** el frontend llama a la API con `VITE_API_URL`. CORS permite solo `FRONTEND_URL` (por defecto `http://localhost:5173`).

**Capas backend:** `routes` → `controllers` → `services` → Prisma → PostgreSQL.

**Capas frontend:** `pages` → `hooks` / `services` → API; `ProtectedRoute` + `AuthContext` para sesión y roles.

---

## Estructura de carpetas

### Backend (`/backend`)

| Carpeta / archivo | Responsabilidad |
|-------------------|-----------------|
| `src/config/` | Variables de entorno, Prisma client, Swagger |
| `src/controllers/` | HTTP: parsear request, delegar a services, responder |
| `src/services/` | Lógica de negocio (auth, polls, votes, dashboard) |
| `src/routes/` | Definición de rutas y middlewares por módulo |
| `src/middlewares/` | JWT, roles, validación Zod, errores globales |
| `src/schemas/` | Esquemas Zod de entrada |
| `src/utils/` | JWT, passwords, respuestas estándar, `AppError` |
| `src/types/` | Tipos TypeScript compartidos |
| `src/docs/` | Anotaciones OpenAPI (paths y schemas) |
| `prisma/` | `schema.prisma`, migraciones, `seed.ts` |

### Frontend (`/frontend`)

| Carpeta | Responsabilidad |
|---------|-----------------|
| `src/components/` | UI reutilizable (auth, polls, dashboard, layout, states) |
| `src/pages/` | Vistas por ruta (Welcome, Login, Admin, User, Dashboard) |
| `src/layouts/` | `AppLayout`, `AuthLayout` |
| `src/services/` | Cliente Axios, auth y polls |
| `src/hooks/` | `useAuth`, `usePolls`, `usePolling` |
| `src/context/` | Auth y tema |
| `src/types/` | Modelos TypeScript alineados con la API |
| `src/routes/` | `AppRoutes`, `ProtectedRoute` |
| `src/mocks/` | Datos locales si `VITE_USE_MOCKS=true` |
| `src/lib/` | Tokens de diseño (`design-tokens.ts`) |

---

## Requisitos previos

- **Node.js** 18 o superior  
- **npm** 9+  
- **Docker Desktop** (para PostgreSQL)  
- Puertos libres: **3000** (API), **5173** (frontend), **5433** (PostgreSQL en Docker)

---

## Cómo correr el proyecto desde cero

### 1. Clonar el repositorio

```bash
git clone https://github.com/Juanitowski-8/PulseVote.git
cd PulseVote
```

### 2. Levantar PostgreSQL

**Opción recomendada — Docker Compose:**

```bash
docker compose up -d
```

Verifica que el contenedor `pulsevote-postgres` esté en ejecución (`docker compose ps`).

**Alternativa — script (Windows):**

```powershell
.\scripts\start-postgres.ps1
```

> La base de datos escucha en **localhost:5433** (mapeo `5433:5432` del contenedor).

### 3. Backend

```bash
cd backend
```

**Windows (PowerShell):**

```powershell
copy .env.example .env
```

**Linux / macOS:**

```bash
cp .env.example .env
```

Edita `.env` si necesitas otro `JWT_SECRET` (mínimo 16 caracteres). Luego:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Deberías ver: `PulseVote API en http://localhost:3000`

**Build de producción (opcional):**

```bash
npm run build
npm start
```

**Tests backend (integración):** requiere PostgreSQL activo — ver [backend/README.md](backend/README.md).

```bash
cd backend
npm run test
```

**Tests frontend (componentes):**

```bash
cd frontend
npm run test
```

### 4. Frontend

En **otra terminal**, desde la raíz del monorepo:

```bash
cd frontend
```

```powershell
# Windows
copy .env.example .env
```

```bash
# Linux / macOS
cp .env.example .env
```

Contenido recomendado de `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCKS=false
```

```bash
npm install
npm run dev
```

### 5. URLs

| Recurso | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **API (base)** | http://localhost:3000/api |
| **Health** | http://localhost:3000/api/health |
| **Swagger** | http://localhost:3000/api/docs |

### 6. Verificación rápida

```bash
curl http://localhost:3000/api/health
```

Respuesta esperada: `{"status":"ok","service":"pulsevote-api"}`

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Conexión Prisma a PostgreSQL | `postgresql://pulsevote_user:pulsevote_password@localhost:5433/pulsevote?schema=public` |
| `JWT_SECRET` | Secreto para firmar tokens (≥16 caracteres) | `change_me_to_a_long_random_secret` |
| `JWT_EXPIRES_IN` | Caducidad del token | `24h` |
| `PORT` | Puerto del servidor Express | `3000` |
| `FRONTEND_URL` | Origen permitido por CORS | `http://localhost:5173` |

Plantilla: `backend/.env.example`

### Frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API | `http://localhost:3000/api` |
| `VITE_USE_MOCKS` | `true` = datos en localStorage sin backend; `false` = API real | `false` |

Plantilla: `frontend/.env.example`

> Los archivos `.env` están en `.gitignore` y **no deben subirse** al repositorio.

---

## Endpoints principales

Prefijo base: `/api`

### Auth

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| `POST` | `/auth/login` | Login; devuelve JWT y usuario | Público |
| `GET` | `/auth/me` | Usuario autenticado actual | Autenticado |

### Polls

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| `GET` | `/polls` | Listar (`?active=true` para solo activas) | Autenticado |
| `GET` | `/polls/:id` | Detalle de encuesta | Autenticado |
| `POST` | `/polls` | Crear encuesta | **ADMIN** |
| `PUT` | `/polls/:id` | Actualizar encuesta | **ADMIN** |
| `DELETE` | `/polls/:id` | Eliminar encuesta | **ADMIN** |
| `GET` | `/polls/:id/results` | Resultados agregados | Autenticado |

### Votes

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| `POST` | `/polls/:id/vote` | Registrar voto (`{ "optionId": "..." }`) | **USER** |

### Dashboard

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| `GET` | `/dashboard/summary` | Métricas y listado resumido | ADMIN / USER* |
| `GET` | `/dashboard/polls/:id/results` | Resultados detallados para gráficos | ADMIN / USER* |

\* El backend expone dashboard a ambos roles con datos adaptados; en el **frontend**, la ruta `/dashboard` está reservada al **ADMIN**.

### Salud y documentación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| — | `/docs` | Interfaz Swagger UI |

**Formato de respuesta:** auth, vote y dashboard usan envelope `{ success, message?, data }`. Errores: `{ success: false, error: { code, message } }`. Algunos endpoints de polls devuelven el recurso directamente.

Detalle completo e interactivo: **http://localhost:3000/api/docs**

---

## Decisiones técnicas

| Decisión | Motivo |
|----------|--------|
| **Node + Express + TypeScript** | Ecosistema maduro, tipado en API y alineación con el frontend TS |
| **Prisma** | Migraciones declarativas, tipos generados y DX rápida para PostgreSQL |
| **PostgreSQL** | Integridad relacional, `UNIQUE` para voto único y consultas analíticas del dashboard |
| **JWT** | Stateless para API REST; suficiente para el alcance de la prueba |
| **Zod** | Validación de entrada tipada y mensajes coherentes en el middleware |
| **Polling (3 s)** | Implementación simple y predecible frente a WebSocket/SSE en el tiempo disponible |
| **Controller / Service / Routes** | Separación de responsabilidades: HTTP vs negocio vs wiring |
| **`@@unique([userId, pollId])`** | Garantía en BD ante condiciones de carrera, además de comprobar en servicio |
| **bcrypt** | Hash de contraseñas en seed y login |
| **Swagger** | Facilita revisión por evaluadores y pruebas sin leer todo el código |
| **Monorepo** | Un solo clone para frontend + backend + Docker |

---

## Trade-offs

Se priorizó **flujo funcional completo**, **arquitectura clara** y **README evaluable** dentro del plazo de una prueba técnica.

| Tema | Enfoque actual | Mejora posible |
|------|----------------|----------------|
| Tiempo real | Polling HTTP cada 3 s | WebSocket o SSE |
| Sesión | JWT con expiración fija | Refresh tokens |
| Tests | Pruebas manuales documentadas | Tests E2E / integración automatizados |
| Deploy | Solo local con Docker DB | CI/CD y hosting (Railway, Vercel, etc.) |
| Exportación | — | Export CSV/PDF de resultados |
| Analítica | Dashboard básico | Históricos, filtros por fecha |
| Mocks | `VITE_USE_MOCKS` para demo sin API | Mantener solo para desarrollo offline |

---

## Uso de IA

Este proyecto se desarrolló con **apoyo de herramientas de IA** (Cursor) para:

- Estructura inicial de carpetas y boilerplate  
- Componentes de UI y estilos base  
- Revisión de integración frontend–backend y mensajes de error  
- Documentación (README, Swagger, checklists)

**Trabajo humano posterior:** revisión de código, ajustes de arquitectura, pruebas manuales de auth, roles, CRUD, votos (incluido 409 por duplicado), dashboard y correcciones de UX.

Estoy preparado para **explicar cualquier módulo en entrevista** y para **implementar cambios en vivo** sobre esta base.

---

## Pruebas manuales

Checklist detallado: **[docs/CHECKLIST-ENTREGA.md](docs/CHECKLIST-ENTREGA.md)**

Resumen:

- [ ] Login **admin** → `/admin/polls`  
- [ ] Crear y editar encuesta (mínimo 2 opciones)  
- [ ] Activar / desactivar y eliminar encuesta  
- [ ] Abrir **dashboard** → métricas y gráfica se actualizan  
- [ ] Login **user** → ver solo encuestas activas  
- [ ] Votar → éxito; votar otra vez → mensaje claro (409)  
- [ ] User no accede a rutas de admin  
- [ ] Probar endpoints en **Swagger**  
- [ ] Apagar backend → frontend muestra error de conexión legible  

---

## Mejoras futuras

- WebSocket / SSE para resultados en vivo sin polling  
- Refresh tokens y rotación de sesión  
- Suite de tests (unitarios + integración + E2E)  
- Exportación de resultados (CSV)  
- Notificaciones al cerrar encuesta o alcanzar umbral de votos  
- Analítica avanzada (tendencias, comparativas)  
- Despliegue automatizado (Docker full-stack, CI)  

---

## Documentación adicional

| Documento | Contenido |
|-----------|-----------|
| [docs/HISTORIAL-PROMPTS-Y-COMMITS.md](docs/HISTORIAL-PROMPTS-Y-COMMITS.md) | Trazabilidad prompts → cambios → commits (revisión empresa) |
| [docs/GUIA-ENTREVISTA.md](docs/GUIA-ENTREVISTA.md) | Guía para defender el proyecto y cambios en vivo |
| [docs/ESTADO-SISTEMA.md](docs/ESTADO-SISTEMA.md) | Estado técnico y decisiones del proyecto |
| [docs/CHECKLIST-ENTREGA.md](docs/CHECKLIST-ENTREGA.md) | Checklist paso a paso para evaluación |
| [backend/README.md](backend/README.md) | Detalle específico de la API |

---

## Autor

**Juan** — PulseVote (prueba técnica full-stack)

---

## Licencia

Proyecto académico / prueba técnica. Uso según indicaciones del evaluador.
