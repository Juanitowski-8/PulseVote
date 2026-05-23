# PulseVote — Estado del sistema

> Documento de referencia para consultas futuras (IA, desarrollo, entrega).  
> **Última actualización:** 22 de mayo de 2026  
> **Repositorio:** [github.com/Juanitowski-8/PulseVote](https://github.com/Juanitowski-8/PulseVote)  
> **Rama activa:** `main` (commits locales pendientes de `push` según momento de lectura)

---

## 1. Resumen ejecutivo

| Área | Estado | Comentario |
|------|--------|------------|
| **Frontend (UI/UX)** | ✅ Avanzado | Landing premium SaaS, login, admin, user, dashboard, tema día/noche en app |
| **Frontend (landing / marca)** | ✅ Refinado | Paleta fija oscura, hero legible, logo SVG, preview dashboard |
| **Frontend (datos)** | 🟡 Mocks por defecto | `VITE_USE_MOCKS=true` — API preparada pero no integrada del todo |
| **Backend (API)** | ✅ Funcional | Auth JWT, CRUD encuestas, votos, dashboard |
| **Base de datos** | ✅ Lista | Prisma + PostgreSQL + migración + seed |
| **FE ↔ BE integración** | ❌ Pendiente | Envelope auth y shape de respuestas sin unificar |
| **Swagger/OpenAPI** | ❌ Pendiente | No implementado |
| **README completo (prueba técnica)** | 🟡 Parcial | Guía rápida en raíz + este documento |
| **Tests automatizados** | ❌ Pendiente | Sin unit/E2E |
| **Despliegue (prod)** | ❌ Pendiente | Solo desarrollo local |
| **Git / historial** | ✅ Activo | Commits frecuentes en `main`; ver §9 |

**En una frase:** PulseVote **se ve y opera de punta a punta en el frontend con mocks**; el **backend está listo para consumirse**; la **landing y marca están en nivel SaaS premium**; falta **conectar FE↔BE por completo** y cerrar entrega (Swagger, tests, README técnico, deploy).

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
├── backend/                 # API REST
├── frontend/                # SPA React
│   └── src/
│       ├── components/
│       │   ├── brand/       # PulseVoteLogo, PulseVoteBrand
│       │   ├── welcome/     # Landing: hero, ambient, secciones
│       │   ├── layout/      # Navbar, sidebar, fondos
│       │   ├── polls/       # CRUD y voto UI
│       │   ├── dashboard/   # Métricas y gráficas
│       │   └── ui/          # Primitivos shadcn-style
│       ├── pages/
│       ├── services/        # api, auth, polls (+ mocks)
│       └── mocks/
├── docs/
│   └── ESTADO-SISTEMA.md    # Este archivo
├── scripts/
├── docker-compose.yml
└── README.md
```

---

## 4. Estado del frontend

### ✅ Implementado

| Módulo | Descripción |
|--------|-------------|
| **Landing (`/`)** | Hero premium centrado, badge, CTAs, preview dashboard, secciones Cómo funciona / Roles |
| **Fondo landing** | `LandingAmbient` — gradientes muy suaves + rejilla al ~2.5% opacidad (sin matrix) |
| **Navbar landing** | `WelcomeNavbar` — logo + nav + CTAs con paleta fija |
| **Logo / marca** | `PulseVoteLogo` — isotipo SVG (pulse + check + barras) + `PulseVoteBrand` |
| **Hero visual** | `HeroDashboardPreview` — stats + panel de resultados estático elegante |
| **Login (`/login`)** | Formulario, validación, cuentas demo, preset por rol (`AuthLayout` + landing styles) |
| **Admin (`/admin/polls`)** | CRUD encuestas (mock), activar/desactivar, modal formulario |
| **User (`/user/polls`)** | Listar activas, votar, voto único, estados UI |
| **Dashboard (`/dashboard`)** | Métricas, gráfica Recharts, tabla, polling 3s (mock) |
| **Auth** | `AuthContext`, rutas protegidas por rol |
| **Tema app** | Modo día / nocturno (`ThemeContext`), toggle fijo inferior izquierda |
| **Fondo app (no landing)** | `PremiumLedBackground` — halo mínimo en rutas internas oscuras |
| **Servicios** | `api.ts`, `authService.ts`, `pollService.ts` con bifurcación mock/real |
| **Mocks** | `mockStore` + `localStorage` persistente, simulación de votos en vivo en dashboard |

### 🟡 Parcial / deuda técnica frontend

- Servicios **no parsean** por completo el envelope `{ success, message, data }` del backend en auth.
- `authService.me()` espera `User` plano; backend devuelve envelope.
- Keys en `localStorage`: `pulsevote_token` / `pulsevote_user` (migración automática desde `verdicta_*` si existían).
- Dashboard polling en mock **simula** votos aleatorios; con API real deben ser datos reales.
- Componentes legacy aún en repo sin uso en landing actual: `DaybreakHeroVisual`, `LivePreviewMock` (sustituidos por diseño premium).
- Sin tests, sin Storybook, sin i18n.
- Toggle día/noche no altera la landing (paleta landing siempre oscura premium).

### Rutas frontend

| Ruta | Rol | Estado |
|------|-----|--------|
| `/` | Público | ✅ Landing premium |
| `/login` | Público | ✅ |
| `/admin/polls` | ADMIN | ✅ (mock por defecto) |
| `/user/polls` | USER | ✅ (mock por defecto) |
| `/dashboard` | ADMIN | ✅ (mock por defecto) |
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
# frontend/.env (o .env.example)
VITE_USE_MOCKS=true          # ← mocks activos si no es exactamente 'false'
VITE_API_URL=http://localhost:3000/api
```

Lógica en `frontend/src/services/api.ts`:

```ts
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
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
- [ ] Quitar o condicionar simulación de votos en dashboard cuando hay API real
- [ ] Unificar nombres `localStorage` (opcional: `pulsevote_token`)

### Incompatibilidades conocidas

| Tema | Frontend | Backend |
|------|----------|---------|
| Auth login/me | Objeto plano esperado | Envelope `{ success, data }` |
| Marca en storage | `pulsevote_*` (mocks: `pulsevote_mock_data`) | N/A |
| Polling dashboard | Simula votos en mock | Datos reales vía API |

---

## 8. Diseño y UX (estado visual)

### Landing y marca (paleta fija — siempre oscura premium)

La clase `.landing-page` aplica una paleta independiente del toggle de tema en el resto de la app:

| Token | Valor | Uso |
|-------|-------|-----|
| Fondo principal | `#020D0A` | Body landing |
| Surface | `#071A14` | Cards, panel preview |
| Surface soft | `#0B241B` | Badge, fondos secundarios |
| Border | `#12382B` | Bordes sutiles |
| Primary | `#00F58A` | Acento, CTAs, barras |
| Primary medium | `#00B86B` | Degradados |
| Primary dark | `#006B45` | Fin de degradados |
| Text main | `#F3FFF8` | Títulos y copy principal |
| Text muted | `#8FA99B` | Subtítulos y apoyo |

**Principios aplicados (rediseño mayo 2026):**
- Sin matrix, orbes LED ni shimmer en título.
- Glow mínimo (solo acento en logo opcional).
- Jerarquía clara: badge → título con gradiente solo en “PulseVote” → subtítulo blanco → texto muted → CTAs → preview dashboard.
- Inspiración SaaS: Linear / Vercel / Stripe / OpenAI (sin copia literal).

### Componentes clave de landing

| Componente | Rol |
|------------|-----|
| `LandingAmbient` | Fondo ambiental estático muy sutil |
| `WelcomeNavbar` | Navegación + logo + CTAs |
| `WelcomePage` | Composición hero + secciones |
| `HeroDashboardPreview` | Mock dashboard (stats + barras) |
| `HowItWorks` | 3 pasos del flujo |
| `RoleEntryCards` | Entrada admin / usuario |
| `PulseVoteLogo` | Isotipo SVG reutilizable |
| `PulseVoteBrand` | Logo + texto en navbar |

### Isotipo `PulseVoteLogo` (lectura en 3 capas)

1. **Arcos superiores** — señal / pulso en tiempo real  
2. **Check central** — voto confirmado  
3. **Barras inferiores sólidas** — resultados de encuesta  
4. **Marco redondeado** `#071A14` — lectura como icono de app  

Archivos: `frontend/src/components/brand/PulseVoteLogo.tsx`, `frontend/public/favicon.svg`

Utilidades CSS en `index.css`: `.landing-badge`, `.landing-brand-text`, `.landing-btn-primary`, `.landing-btn-secondary`, `.landing-surface-card`

### App interna (post-login)

| Modo | Descripción |
|------|-------------|
| **Día** | Tokens Tailwind claros en sidebar, cards, formularios |
| **Noche** | Tema oscuro global; `PremiumLedBackground` con halo verde muy suave (no en `/`) |
| **Layout** | Sidebar verde oscuro, topbar, páginas admin/user/dashboard |

### Lo que se retiró / dejó de usarse en landing

- `DaybreakHeroVisual` (horizonte LED + lluvia de código) — ya no montado en `WelcomePage`
- Título `.text-gradient-daybreak` animado con drop-shadow fuerte
- `PremiumLedBackground` completo (orbes, rejilla, beams) en ruta `/`
- Vista clara de dos columnas en hero (landing unificada en oscuro premium)

---

## 9. Git y despliegue

- **Rama principal:** `main`
- **Remoto:** `https://github.com/Juanitowski-8/PulseVote.git`
- **Política de trabajo:** los cambios deben **commitearse** en el repo (no dejar trabajo solo local).

### Commits recientes relevantes (orden cronológico inverso)

| Hash | Resumen |
|------|---------|
| `f3b318a` | fix(frontend): logo PulseVote más legible (pulse, voto, resultados) |
| `894000a` | feat(frontend): landing premium SaaS, logo y fondo minimalista |
| `5f330f5` | docs: enlace a ESTADO-SISTEMA en README raíz |
| `8f2499c` | docs: estado actual del sistema |
| `9101f76` | feat(frontend): fondo animado LED (generación anterior) |
| `54900f7` | feat(frontend): modo oscuro Daybreak |
| `d5d493c` | feat(frontend): toggle día/nocturno |

### Pendiente en Git / DevOps

- **No hay:** GitHub Actions, Docker para app frontend/backend, despliegue Vercel/Railway documentado
- Verificar `git push` si `main` está ahead of `origin/main`

---

## 10. Qué falta — roadmap sugerido

### Prioridad alta (MVP entregable)
1. **Conectar frontend al backend** (auth + polls + vote + dashboard)
2. **README completo** de prueba técnica (descripción, decisiones, trade-offs, IA, capturas)
3. **Swagger** básico en `/api/docs`
4. **Prueba manual E2E** documentada (checklist en README)
5. **`git push`** y tag/release si aplica entrega

### Prioridad media
6. Tests mínimos (auth service, voto duplicado 409)
7. Manejo de errores API unificado en frontend (interceptor + toasts)
8. Dashboard polling solo con API (sin simulación mock)
9. Registro opcional o invitación de usuarios
10. Limpiar componentes legacy no usados (`DaybreakHeroVisual`, `LivePreviewMock`) o documentar como archivo histórico

### Prioridad baja / mejoras
11. WebSocket en lugar de polling
12. Paginación, búsqueda, exportar resultados
13. PWA, notificaciones
14. CI (lint + build + tests en PR)
15. Logo en sidebar/topbar de app interna (hoy concentrado en landing/navbar)

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
| Monorepo `frontend/` + `backend/` | Claridad en prueba técnica |
| Landing con paleta fija oscura | Legibilidad y sensación SaaS premium |
| Fondo landing minimalista (`LandingAmbient`) | Evitar ruido visual (matrix, orbes) |
| Isotipo en 3 capas (pulse + check + barras) | Comunicar producto sin depender de texto |
| Polling 3s en dashboard | “Tiempo real” sin WebSocket en ventana corta |
| Mocks en frontend primero | UI entregable antes de integración total |
| Prisma 5 (no 7) | Evitar breaking changes de Prisma 7 |
| PostgreSQL en puerto **5433** | Conflicto con instancia local en 5432 |
| JWT stateless | Simple y estándar |
| Envelope en respuestas auth | Consistencia y mensajes claros en API |
| Commits frecuentes en `main` | Trazabilidad de todo cambio en el repo |

---

## 13. Trade-offs por límite de tiempo

- Frontend desarrollado con mocks antes de integración total con API.
- Sin WebSocket (polling suficiente para el requisito inicial).
- Sin registro de usuarios (solo seed).
- Swagger y tests automatizados pendientes.
- Iteración visual fuerte en landing (dos fases: LED Daybreak → premium minimalista).
- Componentes antiguos de landing aún en código sin eliminar (deuda menor).

---

## 14. Historial de entregas (contexto)

1. Análisis de arquitectura y plan de implementación  
2. Frontend completo con mocks (Verdicta → PulseVote)  
3. Backend base (Express, Prisma, JWT, CRUD, votos, dashboard)  
4. Módulo auth/autorización refinado  
5. Subida a GitHub + flujo de commits  
6. Landing estilo OpenAI + modo día/noche  
7. Fondo Daybreak verde + animación LED premium (generación anterior)  
8. **Rediseño landing SaaS premium** — paleta fija, hero legible, sin matrix  
9. **Logo `PulseVoteLogo`** — SVG con pulse, voto y resultados  
10. **Refinamiento logo** — mayor legibilidad en tamaños pequeños  
11. **Documentación** — actualización integral de este archivo  

---

## 15. Mantenimiento de este documento

Actualizar **en el mismo commit o inmediatamente después** cuando ocurra cualquiera de:

- Conexión FE ↔ BE (`VITE_USE_MOCKS=false` estable y probado)
- Cambios de landing, logo, paleta o componentes públicos
- Nuevos endpoints, modelos Prisma o variables de entorno
- Swagger, tests, CI/CD o despliegue
- Cierre del README de prueba técnica
- Commits relevantes en `main` (reflejar hashes en §9)

---

*PulseVote — encuestas en tiempo real*
