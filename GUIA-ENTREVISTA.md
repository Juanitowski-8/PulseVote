# Guía de entrevista técnica — PulseVote

Documento para **preparar la entrevista**: explicar código, decisiones, arquitectura y **cambios en vivo** con seguridad.

Enlaces útiles: [README.md](README.md) · [CHECKLIST-ENTREGA.md](CHECKLIST-ENTREGA.md)

---

## 1. Pitch de 30 segundos

> **PulseVote** es una plataforma **full-stack de encuestas en tiempo real**. Los administradores crean y gestionan encuestas con varias opciones; los participantes se registran o inician sesión y votan **una sola vez** por encuesta. El backend en **Node, Express, Prisma y PostgreSQL** aplica reglas de rol, valida con **Zod** y garantiza el voto único con lógica de servicio más restricción **`@@unique([userId, pollId])`**. El frontend en **React y Vite** usa **JWT**, rutas protegidas por rol y un **dashboard** con gráficos **Recharts** que se actualizan cada **3 segundos** con **polling**, sin recargar la página. Cada admin solo ve **sus** encuestas; los usuarios ven **todas** las publicadas. La API está documentada en **Swagger**.

**Memoriza el hilo:** login → crear encuesta (admin) → votar (user) → resultados en vivo → seguridad por capas.

---

## 2. Arquitectura general

### Monorepo

```text
PulseVote/
├── backend/     API REST (Express + Prisma)
├── frontend/    SPA (React + Vite)
├── docker-compose.yml   # solo PostgreSQL
└── package.json         # npm workspaces (scripts dev/build/test)
```

**Por qué:** un solo repo para la prueba técnica; scripts en raíz (`npm run dev:backend`, `npm run dev:frontend`) y dependencias compartidas vía workspaces.

### Backend por capas

```text
Request → Route → Middleware (auth / roles / Zod) → Controller → Service → Prisma → PostgreSQL
```

| Carpeta | Responsabilidad |
|---------|-----------------|
| `routes/` | URL + método + encadenar middlewares |
| `controllers/` | Leer `req`, llamar service, responder con envelope |
| `services/` | Reglas de negocio (auth, polls, vote, dashboard) |
| `middlewares/` | JWT, roles, validación, errores globales |
| `schemas/` | Zod (entrada HTTP) |
| `config/` | env, Prisma client, Swagger |
| `utils/` | JWT, bcrypt, `AppError`, helpers de respuesta |

**Frase entrevista:** *“El controller no tiene SQL; el service no conoce Express. Así pruebo la lógica y cambio la API sin mezclar capas.”*

### Frontend por capas

```text
Page → Components → Hooks / Context → Services (axios) → Backend API
```

| Carpeta | Responsabilidad |
|---------|-----------------|
| `pages/` | Pantallas por ruta |
| `components/` | UI reutilizable (polls, auth, dashboard, layout) |
| `routes/` | `AppRoutes`, `ProtectedRoute` |
| `context/` | `AuthContext`, `ThemeContext` |
| `services/` | `authService`, `pollService`, `api.ts` |
| `hooks/` | `usePolls`, `usePolling`, `useAuth` |

**Por qué es mantenible:** las páginas no arman URLs a mano; un cambio de contrato API se toca en `services/`.

---

## 3. Backend (qué decir en entrevista)

| Pieza | Rol en PulseVote |
|-------|------------------|
| **Express + TypeScript** | API REST tipada, middlewares estándar |
| **Routes** | Montan `/api/auth`, `/api/polls`, `/api/dashboard` |
| **Controllers** | Delgados: validan que exista `req.user`, delegan al service |
| **Services** | Auth, listado con scope admin, voto, agregación de resultados |
| **Middlewares** | `authenticate`, `authorizeRoles`, `validate(schema)` |
| **Zod** | Body/query válidos → 400 `VALIDATION_ERROR` |
| **Prisma** | ORM, migraciones, `@@unique` para voto único |
| **AppError** | Errores con `statusCode` + `code` (401, 403, 409…) |
| **error.middleware** | Centraliza `AppError`, Zod, Prisma `P2002` → respuesta JSON uniforme |

**Envelope de respuesta (no JSON plano suelto):**

```json
{ "success": true, "message": "...", "data": { } }
{ "success": false, "message": "...", "error": { "code": "...", "message": "..." } }
```

**Archivos ancla:** `app.ts`, `routes/index.ts`, `utils/AppError.ts`, `middlewares/error.middleware.ts`

---

## 4. Auth (paso a paso)

### Login

1. Frontend: `LoginForm` → `authService.login` → `POST /api/auth/login`
2. Backend: `auth.service.login` busca user por email (minúsculas)
3. Si no existe o password mal → **mismo mensaje** (“Credenciales incorrectas”) → 401 (no filtra si el email existe)
4. `comparePassword` (bcrypt) contra `passwordHash`
5. `signToken({ userId, role })` → JWT
6. Respuesta: `data: { token, user }` sin password

### Registro (existe en el proyecto)

1. `POST /api/auth/register` → rol `USER`, email único
2. `hashPassword` → guarda en BD
3. Devuelve token + user (igual que login)

### Sesión en frontend

1. Guarda `pulsevote_token` y `pulsevote_user` en **localStorage**
2. Interceptor axios: `Authorization: Bearer <token>`
3. Al cargar la app: `AuthContext` lee storage → `GET /api/auth/me` para refrescar user
4. Si `/me` falla con 401 → logout y limpia storage

### Middleware `authenticate`

1. Lee header `Authorization: Bearer …`
2. `verifyToken` → payload `{ userId, role }`
3. **`authService.findUserById`** — recarga user desde BD (rol actualizado)
4. `req.user` disponible para controllers

### Middleware `authorizeRoles('ADMIN' | 'USER')`

Comprueba `req.user.role` ∈ roles permitidos; si no → **403** `FORBIDDEN`.

**Frase clave:** *“El JWT identifica; la BD confirma quién es hoy. Los roles se aplican en middleware, no solo en el frontend.”*

---

## 5. Roles

| Rol | Backend | Frontend |
|-----|---------|----------|
| **ADMIN** | CRUD polls **propias** (`createdById`), dashboard summary/results propios, **no** `POST .../vote` | `/admin/polls`, `/dashboard` |
| **USER** | `GET /polls` todas, `POST .../vote`, **no** crear/editar/borrar polls | `/user/polls`, `/register` |

**Doble protección:** aunque manipulen el frontend, el API devuelve 403 sin el rol correcto.

**Privacidad admin:** `poll.service` filtra `where: { createdById: userId }` para ADMIN; otro admin no ve ni edita encuestas ajenas.

---

## 6. Modelo de datos

```text
User 1──* Poll (createdBy / createdById)
Poll 1──* PollOption
User *──* Poll  mediante Vote
Vote → userId, pollId, optionId
```

| Modelo | Qué guarda |
|--------|------------|
| **User** | `email` único, `passwordHash`, `role` |
| **Poll** | `question`, `description?`, `isActive`, `createdById` |
| **PollOption** | `text`, `pollId` (cascade al borrar poll) |
| **Vote** | quién votó, en qué encuesta, qué opción |

### `@@unique([userId, pollId])`

Una fila de voto por usuario y encuesta. La BD es la **garantía fuerte**; el servicio hace comprobación previa para devolver 409 legible.

**Archivo:** `backend/prisma/schema.prisma`

---

## 7. Voto único

### Validación en servicio (`vote.service.ts`)

1. Poll existe → si no, 404
2. `isActive` → si no, 400 `POLL_NOT_ACTIVE`
3. `optionId` pertenece al poll → si no, 400 `INVALID_OPTION`
4. `findUnique` en `(userId, pollId)` → si existe, 409 `ALREADY_VOTED`
5. `prisma.vote.create`

### Restricción en BD

Segundo insert paralelo → Prisma **P2002** → `error.middleware` traduce a **409** `ALREADY_VOTED`.

### Requests simultáneos (pregunta típica)

Dos votos al mismo tiempo pueden pasar el `findUnique` los dos; **solo uno inserta**. El otro falla en UNIQUE → 409. Correcto para la prueba técnica.

**Solo USER** puede votar; **ADMIN** recibe 403 en la ruta de vote.

---

## 8. Dashboard

| Pieza | Qué hace |
|-------|----------|
| `GET /api/dashboard/summary` | Métricas del admin **solo de sus encuestas** |
| `GET /api/dashboard/polls/:id/results` | Agregados por opción (% redondeado) |
| **Recharts** | Gráficos en `DashboardPage` |
| **`usePolling`** | `intervalMs: 3000` — refresco automático |

### Por qué polling es válido aquí

- Cumple “actualización automática sin recargar la página”
- Implementación simple: `setInterval` + cleanup en unmount
- Sin gestionar conexiones WS, reconexión ni auth en socket

### Qué cambiaría con WebSocket

- El servidor **empuja** cada nuevo voto a clientes suscritos
- Menos HTTP repetido; más complejidad (escala horizontal → Redis pub/sub, sticky sessions)
- Para producción con muchos usuarios en vivo, WS/SSE sería el siguiente paso

**Archivos:** `dashboard.service.ts`, `frontend/src/hooks/usePolling.ts`, `DashboardPage.tsx`

---

## 9. Frontend

| Tecnología | Uso |
|------------|-----|
| React + TypeScript + Vite | SPA, HMR, build rápido |
| React Router | Rutas públicas y protegidas |
| **ProtectedRoute** | Sin sesión → `/login`; rol incorrecto → home del rol |
| **AuthContext** | `login`, `register`, `logout`, init con `/me` |
| **ThemeContext** | Claro/oscuro + `localStorage` |
| **Services** | Axios centralizado, `unwrapData`, `getErrorMessage` |
| **Estados** | `LoadingState`, `ErrorState`, `EmptyState` |

**Modo claro/oscuro:** clase `.dark` en `<html>`, variables CSS `--pv-*`, toggle en navbar/sidebar.

**USER en UI:** lista **todas** las encuestas; botón deshabilitado en inactivas (“Encuesta cerrada”).

---

## 10. Swagger

| | |
|---|---|
| **URL** | http://localhost:3000/api/docs |
| **Para qué** | Probar la API sin Postman; enseñar contrato en entrevista |

**Pasos:**

1. `POST /auth/login` con body admin o user
2. Copiar `data.token` de la respuesta
3. **Authorize** → pegar token (Swagger añade Bearer)
4. Probar `GET /polls`, `POST /polls`, `POST /polls/{id}/vote`, etc.

Las respuestas usan el **envelope** `{ success, message, data }`.

---

## 11. Tests

### Backend (integración — Supertest + Vitest)

```bash
cd backend
npm run test   # requiere PostgreSQL + migrate + seed
```

Cubre: health, register, login, **admin solo ve sus polls**, user ve todas, CRUD, voto, 409 duplicado, 403 roles.

### Frontend (Vitest + RTL)

```bash
cd frontend
npm run test
```

Cubre: `ProtectedRoute`, componentes de auth, theme toggle, etc.

### Qué faltaría

**E2E con Playwright:** login → crear poll → votar → ver dashboard en un solo flujo navegador. Hoy la confianza viene de integración + checklist manual.

**Builds (también correr antes de entregar):**

```bash
cd backend && npm run build
cd frontend && npm run build
```

---

## 12. Trade-offs (respuestas listas)

### Polling vs WebSocket

- **Decisión:** polling 3 s en dashboard.
- **Por qué:** cumple el requisito con poco riesgo y código fácil de explicar.
- **Futuro:** WebSocket o SSE + canal por `pollId`.

### JWT simple vs refresh tokens

- **Decisión:** un access token con `JWT_EXPIRES_IN`.
- **Por qué:** SPA + API stateless, Swagger simple.
- **Futuro:** refresh en httpOnly cookie, rotación, blacklist en logout.

### Docker solo PostgreSQL

- **Decisión:** `docker compose` solo para BD; FE/BE con `npm run dev`.
- **Por qué:** depuración directa en entrevista local.
- **Futuro:** compose con tres servicios o imagen de demo.

### Sin deploy productivo

- **Decisión:** repo orientado a prueba técnica local.
- **Futuro:** CI/CD, Vercel + Render/Railway, secrets en vault.

### Tests básicos vs E2E

- **Decisión:** integración API + unitarios FE en rutas/componentes críticos.
- **Futuro:** Playwright en pipeline.

### Node/Express vs Spring Boot

- **Decisión:** mismo lenguaje TypeScript que el frontend, Express ligero para REST.
- **Futuro:** si el equipo es Java, el dominio (Prisma → JPA) se traslada; las reglas de negocio son las mismas.

---

## 13. Preguntas difíciles (respuestas cortas)

| Pregunta | Respuesta |
|----------|-----------|
| **¿Dos votos a la vez?** | UNIQUE en BD; el segundo → P2002 → 409. Puede haber race en el `findUnique`, la BD resuelve. |
| **¿Por qué no WebSocket?** | Alcance y tiempo; polling cumple el requisito. WS sería mejora con más usuarios concurrentes. |
| **¿Por qué no refresh tokens?** | Simplicidad para la prueba; en producción los añadiría. |
| **¿Cómo manejas errores?** | `AppError` + middleware global; Zod → 400; envelope consistente; FE con `getErrorMessage`. |
| **¿Cómo escalas?** | API stateless detrás de load balancer; pool de Prisma; cache de resultados o push; rate limit en `/vote`. |
| **¿Qué para producción?** | HTTPS, secrets fuertes, refresh tokens, WS/SSE, E2E CI, bloquear edición destructiva con votos, observabilidad. |
| **¿Qué hizo la IA?** | Boilerplate, UI, docs. Yo definí reglas, revisé integración, corrí tests y checklist manual. Puedo navegar y cambiar código en vivo. |
| **¿Cómo verificaste?** | `npm run test`, `npm run build`, Swagger, [CHECKLIST-ENTREGA.md](CHECKLIST-ENTREGA.md), flujos admin/user. |

---

## 14. Cambios en vivo posibles (mini guías)

Practica **uno** antes de la entrevista.

### Filtro solo encuestas activas (admin)

- **BE:** `GET /api/polls?active=true` ya filtra en `listPolls` para ADMIN.
- **FE:** `usePolls({ activeOnly: true })` en `AdminPollsPage.tsx`.

### Cambiar intervalo de polling

- **FE:** `DashboardPage.tsx` → en `usePolling`, cambiar `intervalMs: 3000` a `5000`.

### Bloquear eliminación si tiene votos

- **BE:** en `deletePoll`, antes del delete: `vote.count({ where: { pollId } })` → si > 0, `AppError` 409.
- **FE:** deshabilitar botón eliminar si `poll.totalVotes > 0` en `PollCard`.

### Campo obligatorio (ej. description)

- **BE:** `poll.schema.ts` → `description: z.string().min(1)`.
- **FE:** validación en formulario de encuesta + mensaje bajo el input.

### Búsqueda de encuestas

- **FE rápido:** `polls.filter(p => p.question.toLowerCase().includes(q))` en estado local.
- **BE:** query `?search=` en `listPolls` con `question: { contains: q, mode: 'insensitive' }`.

### Endpoint “mis votos”

- **BE:** `GET /api/votes/me` → `prisma.vote.findMany({ where: { userId }, include: { poll, option } })`.
- **Ruta:** `vote.routes.ts` + `authorizeRoles('USER')`.
- **FE (opcional):** sección en `UserPollsPage`.

### Cambiar color / tema

- **FE:** variables en `frontend/src/index.css` (`--primary`, `--pv-main`).
- O ajustar clase `.dark` en `ThemeContext` / `theme.ts`.

---

## 15. Resumen final — checklist de repaso

Antes de la entrevista, marca mentalmente:

- [ ] Pitch de 30 s sin leer
- [ ] Dibujar capas BE y flujo `Request → … → Prisma`
- [ ] Explicar login + JWT + `/me` + `authenticate` + `authorizeRoles`
- [ ] ADMIN solo sus polls (`createdById`); USER ve todas, vota en activas
- [ ] `@@unique([userId, pollId])` + race condition
- [ ] Dashboard: summary, results, Recharts, polling 3 s
- [ ] Swagger: login → Authorize → endpoint protegido
- [ ] Tests: qué cubren y qué falta (E2E)
- [ ] Trade-offs: polling, JWT, Docker, sin deploy
- [ ] Un cambio en vivo ensayado (polling o bloquear delete)
- [ ] Archivos abiertos: `schema.prisma`, `vote.service.ts`, `auth.middleware.ts`, `AppRoutes.tsx`, `usePolling.ts`

### Archivos ancla (compartir pantalla)

| Tema | Ruta |
|------|------|
| Auth | `backend/src/services/auth.service.ts` |
| JWT | `backend/src/middlewares/auth.middleware.ts` |
| Roles | `backend/src/middlewares/role.middleware.ts` |
| Voto | `backend/src/services/vote.service.ts` |
| Scope admin | `backend/src/services/poll.service.ts` → `listPolls` |
| Errores | `backend/src/middlewares/error.middleware.ts` |
| Schema | `backend/prisma/schema.prisma` |
| Rutas FE | `frontend/src/routes/AppRoutes.tsx` |
| Sesión FE | `frontend/src/context/AuthContext.tsx` |
| API client | `frontend/src/services/api.ts` |
| Polling | `frontend/src/hooks/usePolling.ts` |

### Errores que NO debes cometer al hablar

| Evitar | Decir mejor |
|--------|-------------|
| “Solo valido voto único en frontend” | Servicio + UNIQUE en BD |
| “Ya hay WebSocket” | Es polling; WS es mejora |
| “Cualquiera crea encuestas” | Solo ADMIN; register crea USER |
| “Admin ve todas las encuestas” | Solo las que creó |
| “USER solo ve activas” | Ve todas; vota en activas |
| Inventar endpoints | Mirar `routes/` o Swagger |

---

*PulseVote — guía alineada con el código en `main`. Repasa con [CHECKLIST-ENTREGA.md](CHECKLIST-ENTREGA.md).*
