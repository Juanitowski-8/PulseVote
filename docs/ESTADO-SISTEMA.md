# PulseVote — Estado del sistema

> Documento de referencia para consultas futuras.  
> **Última actualización:** mayo 2026  
> **Repositorio:** [github.com/Juanitowski-8/PulseVote](https://github.com/Juanitowski-8/PulseVote)

---

## 1. Resumen ejecutivo

| Área | Estado | Comentario |
|------|--------|------------|
| **Frontend (UI/UX)** | ✅ Avanzado | Landing Daybreak+LED, login, admin, user, dashboard, modo día/noche |
| **Frontend (datos)** | 🟡 Mocks por defecto | `VITE_USE_MOCKS=true` — no conectado al API real aún |
| **Backend (API)** | ✅ Funcional | Auth JWT, CRUD encuestas, votos, dashboard |
| **Base de datos** | ✅ Lista | Prisma + PostgreSQL + migración + seed |
| **FE ↔ BE integración** | ❌ Pendiente | Formato de respuestas y servicios sin adaptar |
| **Swagger/OpenAPI** | ❌ Pendiente | No implementado |
| **README completo (prueba técnica)** | 🟡 Parcial | Solo guía rápida en raíz |
| **Tests automatizados** | ❌ Pendiente | Sin unit/E2E |
| **Despliegue (prod)** | ❌ Pendiente | Solo desarrollo local |

**En una frase:** la aplicación se ve y funciona de punta a punta con **mocks en el frontend**; el **backend está listo para consumirse**, pero falta **conectar ambos capas** y cerrar documentación/DevOps de entrega.

---

## 2. Stack tecnológico

### Frontend (`/frontend`)
- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 + componentes estilo shadcn/ui
- React Router DOM v7
- Recharts (gráficas dashboard)
- Axios (cliente HTTP preparado)
- Lucide React (íconos)

### Backend (`/backend`)
- Node.js + Express 5 + TypeScript
- PostgreSQL + Prisma 5.22
- JWT + bcrypt
- Zod (validaciones)
- Morgan + CORS + dotenv

### Infraestructura local
- Docker Compose (`docker-compose.yml`) — PostgreSQL 16
- Puerto host **5433** → contenedor 5432
- Scripts PowerShell: `scripts/start-postgres.ps1`

---

## 3. Estructura del monorepo

```
PulseVote/
├── backend/          # API REST
├── frontend/         # SPA React
├── docs/             # Documentación (este archivo)
├── scripts/          # Utilidades (PostgreSQL)
├── docker-compose.yml
└── README.md         # Guía rápida de arranque
```

---

## 4. Estado del frontend

### ✅ Implementado

| Módulo | Descripción |
|--------|-------------|
| **Landing (`/`)** | Intro al producto, flujo admin/user, estilo OpenAI Daybreak en oscuro |
| **Fondo LED** | Animación premium en modo nocturno (orbes, rejilla, horizonte) |
| **Login (`/login`)** | Formulario, validación, cuentas demo, preset por rol |
| **Admin (`/admin/polls`)** | CRUD encuestas (mock), activar/desactivar, modal formulario |
| **User (`/user/polls`)** | Listar activas, votar, voto único, estados UI |
| **Dashboard (`/dashboard`)** | Métricas, gráfica Recharts, tabla, polling 3s (mock) |
| **Auth** | `AuthContext`, rutas protegidas por rol |
| **Tema** | Modo día / nocturno, botón fijo inferior izquierda, `localStorage` |
| **Componentes** | UI, layout, polls, dashboard, states, welcome |
| **Servicios** | `api.ts`, `authService.ts`, `pollService.ts` con bifurcación mock/real |
| **Mocks** | `mockStore` + `localStorage` persistente, simulación de votos en vivo |

### 🟡 Parcial / deuda técnica frontend

- Servicios apuntan al API pero **no parsean** el envelope `{ success, message, data }` del backend en auth.
- `authService.me()` espera `User` plano; backend devuelve envelope.
- Keys en `localStorage`: `verdicta_token` / `verdicta_user` (nombre legacy).
- Dashboard polling en mock **simula** votos aleatorios; con API real usará datos reales.
- Sin tests, sin Storybook, sin i18n.

### Rutas frontend

| Ruta | Rol | Estado |
|------|-----|--------|
| `/` | Público | ✅ |
| `/login` | Público | ✅ |
| `/admin/polls` | ADMIN | ✅ (mock) |
| `/user/polls` | USER | ✅ (mock) |
| `/dashboard` | ADMIN | ✅ (mock) |
| `*` | 404 | ✅ |

---

## 5. Estado del backend

### ✅ Implementado

| Módulo | Descripción |
|--------|-------------|
| **Arquitectura** | routes → middlewares → controllers → services → Prisma |
| **Auth** | `POST /api/auth/login`, `GET /api/auth/me` |
| **JWT** | `authenticate` + `authorizeRoles` |
| **Polls** | CRUD + list + detalle + resultados |
| **Votes** | `POST /api/polls/:id/vote` con restricción única |
| **Dashboard** | `GET /api/dashboard/summary`, `GET .../polls/:id/results` |
| **Validación** | Zod en auth, polls, votes |
| **Errores** | `AppError`, middleware global, códigos HTTP |
| **Seed** | Usuarios + encuestas + votos de ejemplo |
| **Migración** | `20240522000000_init` versionada |
| **Health** | `GET /api/health` |

### Respuesta auth (formato actual — importante para integrar FE)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "...",
    "user": { "id", "name", "email", "role" }
  }
}
```

`GET /api/auth/me` usa el mismo patrón con `data` = usuario.

### Endpoints API

| Método | Ruta | Auth | Rol |
|--------|------|------|-----|
| GET | `/api/health` | No | — |
| POST | `/api/auth/login` | No | — |
| GET | `/api/auth/me` | JWT | cualquiera |
| GET | `/api/polls` | JWT | ambos (USER solo activas) |
| GET | `/api/polls/:id` | JWT | ambos |
| POST | `/api/polls` | JWT | ADMIN |
| PUT | `/api/polls/:id` | JWT | ADMIN |
| DELETE | `/api/polls/:id` | JWT | ADMIN |
| GET | `/api/polls/:id/results` | JWT | ambos |
| POST | `/api/polls/:id/vote` | JWT | USER |
| GET | `/api/dashboard/summary` | JWT | ADMIN |
| GET | `/api/dashboard/polls/:id/results` | JWT | ADMIN |

### ❌ Pendiente backend

- Swagger / OpenAPI (`/api/docs`)
- Registro de usuarios público
- Refresh token
- Rate limiting
- Tests (unit / integración)
- CI/CD
- Paginación y filtros avanzados en listados

---

## 6. Base de datos (Prisma)

### Modelos
- `User` (role: ADMIN | USER)
- `Poll` (question, description?, isActive)
- `PollOption`
- `Vote` — restricción `@@unique([userId, pollId])`

### Usuarios seed

| Rol | Email | Contraseña |
|-----|-------|------------|
| ADMIN | `admin@pulsevote.app` | `Admin123!` |
| USER | `user@pulsevote.app` | `User123!` |

### Variables (`backend/.env`)

```env
DATABASE_URL=postgresql://pulsevote_user:pulsevote_password@localhost:5433/pulsevote?schema=public
JWT_SECRET=... (mín. 16 caracteres)
JWT_EXPIRES_IN=24h
PORT=3000
FRONTEND_URL=http://localhost:5173
```

---

## 7. Integración frontend ↔ backend

### Estado actual: **desconectados por defecto**

```env
# frontend/.env
VITE_USE_MOCKS=true          # ← mocks activos
VITE_API_URL=http://localhost:3000/api
```

### Para conectar (checklist)

- [ ] Poner `VITE_USE_MOCKS=false` en `frontend/.env`
- [ ] Adaptar `authService.ts`:
  - Login: leer `response.data.data` (token + user)
  - Me: leer `response.data.data`
- [ ] Verificar que `pollService` coincida con shape de respuestas del API (arrays planos vs envelope)
- [ ] Probar CORS con backend en `3000` y `FRONTEND_URL=http://localhost:5173`
- [ ] Levantar PostgreSQL (`docker compose up -d`) + migrate + seed
- [ ] Probar flujos: login admin → CRUD → dashboard polling; login user → votar → no doble voto
- [ ] Quitar o condicionar `simulateLiveActivity()` en dashboard cuando hay API real
- [ ] Unificar nombres `localStorage` (opcional: `pulsevote_token`)

### Incompatibilidades conocidas

| Tema | Frontend | Backend |
|------|----------|---------|
| Auth login/me | Objeto plano | Envelope `{ success, data }` |
| Marca en storage | `verdicta_*` | N/A |
| Polling dashboard | Simula votos en mock | Datos reales vía API |

---

## 8. Diseño y UX (estado visual)

| Modo | Descripción |
|------|-------------|
| **Día** | Landing clara, dos columnas, preview de dashboard |
| **Noche** | Negro puro, título LED animado, fondo en movimiento, horizonte Daybreak verde |
| **App interna** | Sidebar oscuro verde, cards con tokens de tema |

---

## 9. Git y despliegue

- **Rama principal:** `main`
- **Remoto:** `https://github.com/Juanitowski-8/PulseVote.git`
- Commits recientes incluyen: monorepo inicial, landing, tema día/noche, Daybreak verde, fondo LED animado
- **No hay:** GitHub Actions, Docker para app, despliegue Vercel/Railway documentado

---

## 10. Qué falta — roadmap sugerido

### Prioridad alta (para MVP entregable)
1. **Conectar frontend al backend** (auth + polls + vote + dashboard)
2. **README completo** de prueba técnica (descripción, decisiones, trade-offs, IA, capturas)
3. **Swagger** básico en `/api/docs`
4. **Prueba manual E2E** documentada (checklist en README)

### Prioridad media
5. Tests mínimos (auth service, voto duplicado 409)
6. Manejo de errores API unificado en frontend (interceptor + toasts)
7. Ajustar dashboard polling solo con API (sin simulación mock)
8. Registro opcional o invitación de usuarios

### Prioridad baja / mejoras
9. WebSocket en lugar de polling (mencionado como evolución)
10. Paginación, búsqueda, exportar resultados
11. PWA, notificaciones
12. CI (lint + build + tests en PR)

---

## 11. Comandos rápidos

### Infra + base de datos
```powershell
cd C:\Users\Juane\Downloads\PulseVote
docker compose up -d
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Backend
```powershell
cd backend
npm run dev
# http://localhost:3000/api/health
```

### Frontend
```powershell
cd frontend
npm run dev
# http://localhost:5173
```

### Build de verificación
```powershell
cd backend && npm run build
cd frontend && npm run build
```

---

## 12. Decisiones técnicas registradas

| Decisión | Motivo |
|----------|--------|
| Monorepo `frontend/` + `backend/` | Claridad en prueba técnica, fácil de explicar |
| Polling 3s en dashboard | Cumple “tiempo real” sin WebSocket en 24h |
| Mocks en frontend primero | UI entregable antes de API estable |
| Prisma 5 (no 7) | Evitar breaking changes de config en Prisma 7 |
| PostgreSQL en puerto **5433** | Conflicto con instancia local en 5432 |
| JWT stateless | Simple, estándar en entrevistas |
| Envelope en respuestas auth | Consistencia y mensajes claros |
| Tema LED en oscuro | Diferenciación visual premium |

---

## 13. Trade-offs por límite de tiempo

- Frontend desarrollado con mocks antes de integración total.
- Sin WebSocket (polling suficiente para el requisito).
- Sin registro de usuarios (solo seed).
- Swagger planificado pero no implementado aún.
- Tests automatizados omitidos en favor de flujo funcional y UI.

---

## 14. Historial de entregas en el chat (contexto)

1. Análisis de arquitectura y plan de implementación  
2. Frontend completo con mocks (Verdicta → PulseVote)  
3. Backend base (Express, Prisma, JWT, CRUD, votos, dashboard)  
4. Módulo auth/autorización refinado  
5. Subida a GitHub + flujo de commits  
6. Landing estilo OpenAI + modo día/noche  
7. Fondo Daybreak verde + animación LED premium  

---

## 15. Contacto / mantenimiento del documento

Actualizar este archivo cuando:
- Se conecte FE ↔ BE (`VITE_USE_MOCKS=false` estable)
- Se añada Swagger, tests o despliegue
- Cambien credenciales, puertos o variables de entorno
- Se cierre el README de la prueba técnica

---

*PulseVote — encuestas en tiempo real*
