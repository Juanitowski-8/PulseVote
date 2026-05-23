# Guía de entrevista técnica — PulseVote

> **Versión recomendada para evaluación:** [GUIA-ENTREVISTA.md](../GUIA-ENTREVISTA.md) en la raíz del repositorio.

Documento para **estudiar y defender** el proyecto en entrevista: explicar arquitectura, decisiones y hacer **cambios en vivo** con seguridad.

---

## 1. Explicación corta del proyecto

### Qué es PulseVote

PulseVote es una **plataforma web full-stack de encuestas en tiempo real**. Un admin publica preguntas con opciones; los usuarios votan **una sola vez**; un dashboard muestra métricas y resultados que se refrescan automáticamente.

### Para qué sirve

Permite a un equipo **crear encuestas**, **recoger votos** y **ver resultados agregados** sin herramientas externas, con roles separados (quien gestiona vs quien participa).

### Qué problema resuelve

- Centraliza encuestas y votos en un solo sistema.
- Evita votos duplicados por usuario y encuesta.
- Ofrece visibilidad en vivo de participación (vía polling).

### Flujo extremo a extremo (30 segundos)

1. Admin hace **login** → JWT.
2. Crea encuesta con opciones en PostgreSQL (Prisma).
3. User hace login → ve **todas** las encuestas; vota solo en las **activas**.
4. User elige opción → `POST /polls/:id/vote` → validaciones + insert en `Vote`.
5. Admin abre **dashboard** → cada 3 s pide summary y resultados → gráficos Recharts.

---

## 2. Arquitectura general

### Separación frontend / backend

| Capa | Rol |
|------|-----|
| **Frontend** (React SPA) | UI, rutas, estado de sesión, llamadas HTTP |
| **Backend** (Express API) | Auth, reglas de negocio, persistencia |
| **PostgreSQL** | Fuente de verdad relacional |

Comunican por **REST + JSON**. CORS limitado a `FRONTEND_URL`.

### Backend por capas

```text
HTTP Request
    → routes        (URL + método + middlewares de ruta)
    → middlewares   (authenticate, authorizeRoles, validate Zod)
    → controllers   (extrae req, llama service, envía respuesta)
    → services      (lógica de negocio, Prisma)
    → prisma        (ORM → PostgreSQL)
```

**Por qué es mantenible:** cada capa tiene una responsabilidad. Cambiar “cómo se calculan resultados” va en `poll.service.ts`, no en el controller ni en la ruta.

### Frontend por capas

```text
Usuario
    → pages           (pantallas por ruta)
    → components      (UI reutilizable)
    → hooks / context (estado compartido: auth, polls, polling)
    → services        (axios → API)
    → API backend
```

**Por qué es mantenible:** las páginas no construyen URLs a mano; `pollService` y `authService` centralizan la API. `ProtectedRoute` centraliza quién entra a cada ruta.

---

## 3. Flujo de autenticación (paso a paso)

| Paso | Dónde | Qué pasa |
|------|--------|----------|
| 1 | `LoginForm` | Usuario envía email + password |
| 2 | `authService.login` (FE) | `POST /api/auth/login` |
| 3 | `auth.service.ts` (BE) | Busca user por email; si no existe → mismo error genérico |
| 4 | `comparePassword` (bcrypt) | Compara password plano con `passwordHash` |
| 5 | `signToken` | JWT con `{ userId, role }`, expira según `JWT_EXPIRES_IN` |
| 6 | Respuesta | `{ success, data: { token, user } }` |
| 7 | Frontend | Guarda en `localStorage`: `pulsevote_token`, `pulsevote_user` |
| 8 | `AuthContext` | Actualiza `user`, `token`, `isAuthenticated` |
| 9 | Peticiones siguientes | Interceptor axios añade `Authorization: Bearer <token>` |
| 10 | `authenticate` middleware | Verifica JWT, carga user de BD → `req.user` |
| 11 | `authorizeRoles` | Comprueba que `req.user.role` esté permitido |
| 12 | Al recargar F5 | `AuthContext` lee storage → `GET /auth/me` → refresca user o logout si 401 |

**Frase para entrevista:** *“No guardo la contraseña en el cliente; solo el JWT. En cada request protegida el middleware valida el token y vuelve a cargar el usuario de BD por si cambió el rol.”*

---

## 4. Roles

| Rol | Puede | No puede |
|-----|--------|----------|
| **ADMIN** | CRUD encuestas, dashboard, ver todas las encuestas | Votar (`POST .../vote` → 403) |
| **USER** | Ver activas, votar, ver resultados según reglas | Crear/editar/eliminar encuestas |

**Frontend:** `ProtectedRoute` con `allowedRoles={['ADMIN']}` o `['USER']`. Si el rol no coincide → redirect a su home (`/admin/polls` o `/user/polls`).

**Backend:** `authorizeRoles('ADMIN')` en POST/PUT/DELETE polls; `authorizeRoles('USER')` en vote.

**Por qué separar:** principio de mínimo privilegio; menos superficie de ataque y UI más simple por perfil.

---

## 5. Modelo de datos

```text
User 1──* Poll (createdBy)
Poll 1──* PollOption
User *──* Poll  (vía Vote)
Vote → User, Poll, PollOption
```

| Modelo | Campos clave |
|--------|----------------|
| **User** | email único, passwordHash, role (ADMIN/USER) |
| **Poll** | question, description?, isActive, createdById |
| **PollOption** | text, pollId (cascade delete con poll) |
| **Vote** | userId, pollId, optionId |

### `@@unique([userId, pollId])`

Un usuario **solo puede tener una fila Vote por encuesta**. La BD rechaza un segundo insert con error Prisma `P2002`.

**Doble capa en código:**

1. `findUnique` antes de crear → 409 amigable.
2. Si dos requests llegan a la vez → el segundo falla en BD → capturamos `P2002` → mismo 409.

**Frase clave:** *“La regla de negocio está en el servicio, pero la garantía fuerte está en la base de datos.”*

---

## 6. CRUD de encuestas

### Crear

- Admin envía `question`, `description?`, `isActive`, `options[]`.
- Zod valida en middleware (`createPollSchema`).
- `pollService.createPoll` hace `prisma.poll.create` con `options: { create: [...] }` → opciones **en la misma transacción lógica** ligadas al poll.

### Editar

- `updatePoll` usa **`prisma.$transaction`**:
  - Actualiza cabecera del poll.
  - Opciones con `id` → update texto.
  - Opciones sin `id` → create nuevas.
  - Opciones que ya no vienen en el payload → **delete**.

### Si la encuesta ya tiene votos

- **Hoy:** se permite editar y eliminar opciones; borrar opción puede afectar integridad referencial (votes apuntan a optionId). En producción considerarías bloquear edición destructiva o soft-delete.
- **Para entrevista:** *“Con más tiempo bloquearía eliminar opciones con votos o cerraría la encuesta a edición.”*

### Eliminar

- `prisma.poll.delete` → cascade elimina opciones y votos (onDelete en schema).

### Activar / desactivar

- No hay endpoint `/toggle`; el admin hace **PUT** con `isActive: true/false` (el frontend lee el poll y envía update invertido).

---

## 7. Sistema de votos

**Ruta:** `POST /api/polls/:id/vote` — solo **USER**.

| Validación | Error |
|------------|-------|
| Poll no existe | 404 |
| Poll inactiva | 400 `POLL_NOT_ACTIVE` |
| optionId no pertenece al poll | 400 `INVALID_OPTION` |
| Ya votó | 409 `ALREADY_VOTED` |

Tras crear el voto → `pollService.getPollResults(pollId)` → respuesta incluye **vote + results** actualizados.

**Frontend:** `UserPollsPage` valida opción seleccionada antes de enviar; `getErrorMessage` muestra el `error.message` del backend en español.

---

## 8. Dashboard

### Métricas (ADMIN)

`dashboard.service` agrega: total encuestas, activas, votos, usuarios, participación media, listado reciente.

### Resultados

`buildPollResults` en `poll.service.ts`:

- Cuenta votos por opción con `_count`.
- `percentage = (votos_opción / totalVotes) * 100`, redondeo a 1 decimal.
- Si `totalVotes === 0` → porcentajes en 0.

### Polling cada 3 segundos

- Hook `usePolling`: `setInterval` 3000 ms, cleanup en `useUnmount`.
- Refs estables para no crear intervalos duplicados.
- Refresh “silencioso” usa `isRefreshing`, no bloquea toda la UI con loading full screen.

### Si fuera WebSocket

- El servidor **empujaría** cambios al conectar votos.
- Menos requests HTTP; más complejidad (conexiones, reconexión, auth en WS, escalado horizontal con Redis pub/sub).
- **Para la prueba:** polling fue suficiente y más rápido de implementar bien.

---

## 9. Swagger

- **URL:** http://localhost:3000/api/docs
- **Para qué:** documentación viva; el evaluador prueba sin Postman.
- **Cómo:** elegir endpoint → Try it out → body → Execute.
- **Bearer:** botón **Authorize** → pegar token del login (`data.token` sin "Bearer", Swagger lo añade).

---

## 10. Frontend (mapa mental)

| Pieza | Función |
|-------|---------|
| **AuthContext** | Sesión global: login, logout, init con `/me` |
| **ProtectedRoute** | Redirige a login o al home del rol |
| **authService / pollService** | Llamadas API + `unwrapData` |
| **api.ts** | Axios, interceptors, `getErrorMessage` |
| **usePolls** | Lista + CRUD helpers para admin |
| **usePolling** | Dashboard cada 3 s |
| **Pages** | Welcome, Login, AdminPolls, UserPolls, Dashboard |

**Estados:** `LoadingState`, `EmptyState`, `ErrorState` — evitan pantallas en blanco o JSON crudo al usuario.

**Consumo API:** `VITE_API_URL` + `VITE_USE_MOCKS=false` para backend real.

---

## 11. Diseño UI/UX (qué decir)

- Paleta oficial verde oscuro (`#020D0A`, `#00F58A`, texto `#F3FFF8` / muted `#8FA99B`).
- Modo oscuro por defecto; toggle día/noche en app.
- Componentes base: Button, Card, Input, Badge, Dialog, Alert.
- Landing en dos columnas: copy + preview tipo dashboard (no matrix ni glow excesivo).
- Enfoque en **contraste y legibilidad**, estilo SaaS (Linear/Vercel como referencia, no copia).

---

## 12. Decisiones técnicas — respuestas listas

| Pregunta | Respuesta corta |
|----------|-----------------|
| ¿Node/Express y no Spring? | Mismo stack TypeScript que el frontend, curva baja para prueba, Express ligero para API REST. |
| ¿Prisma? | Migraciones, tipos generados, menos SQL boilerplate. |
| ¿PostgreSQL? | Relaciones, UNIQUE para voto único, agregaciones fiables. |
| ¿JWT? | API stateless, simple para SPA; el trade-off es revocación (mejoraría con refresh/blacklist). |
| ¿Zod? | Validación en runtime alineada con TypeScript, errores 400 claros. |
| ¿Polling vs WebSocket? | Tiempo de entrega; 3 s es aceptable para demo; WS sería siguiente paso. |
| ¿Controllers vs services? | Controllers delgados; services testeables y reutilizables (vote reusa `getPollResults`). |
| ¿Voto único? | Servicio + `@@unique([userId, pollId])` + catch P2002. |
| ¿Más tiempo? | Tests E2E, WebSocket, refresh tokens, bloqueo edición con votos, deploy CI/CD. |

---

## 13. Posibles cambios en vivo — mini guías

### Cerrar encuesta (solo lectura)

- Ya existe `isActive: false` en modelo.
- En vivo: añadir botón “Cerrar” que llame `updatePoll` con `isActive: false`.
- Archivos: `PollCard.tsx`, `AdminPollsPage.tsx` (handler).

### Filtro solo activas (admin)

- `GET /polls?active=true` ya filtra en backend (`listPolls`).
- FE: pasar `activeOnly` en `usePolls` / `pollService.getPolls(true)`.

### Cambiar intervalo de polling

- `DashboardPage.tsx` → `intervalMs: 5000` en `usePolling`.
- O constante en `usePolling.ts` default.

### Description obligatoria

- `poll.schema.ts` → `description: z.string().min(1)`.
- `PollForm.tsx` → campo + validación local.

### Búsqueda de encuestas

- FE: filtrar array `polls.filter(p => p.question.includes(q))`.
- BE (mejor): query `?search=` en `listPolls` con `contains` en Prisma.

### Conteo de votos en lista

- Backend ya devuelve `totalVotes` en listado.
- FE: mostrar en `PollCard` si no se ve — revisar `mapPollFromApi`.

### Bloquear eliminar si tiene votos

- `deletePoll`: antes de delete, `if (await prisma.vote.count({ where: { pollId: id } })) throw 409`.
- FE: deshabilitar botón si `poll.totalVotes > 0`.

### Endpoint “mis votos”

- Nueva ruta `GET /votes/me` → `prisma.vote.findMany({ where: { userId } })`.
- Controller + service + página opcional USER.

---

## 14. Preguntas difíciles

### ¿Dos requests votan al mismo tiempo?

Ambos pueden pasar el `findUnique` si van paralelos; **el segundo insert falla** por UNIQUE en BD → 409. Eso es correcto.

### ¿Dónde se valida el voto único?

1. `vote.service` — lectura previa.  
2. PostgreSQL — `@@unique([userId, pollId])`.  
3. `error.middleware` — P2002 → mensaje 409.

### ¿Token expira?

Sí (`JWT_EXPIRES_IN`). Middleware devuelve 401 → interceptor axios limpia storage y redirige a `/login`.

### ¿Opción de otra encuesta?

`poll.options.some(o => o.id === optionId)` → 400 si no coincide.

### ¿Escalabilidad?

- Stateless API detrás de load balancer.  
- PostgreSQL con índices y connection pool.  
- Polling no escala tan bien como push; cachear resultados o WS con Redis.  
- Rate limit en `/vote`.

### ¿Seguridad?

- bcrypt, JWT secret fuerte, CORS, validación Zod, roles, no filtrar si email existe en login, HTTPS en prod, no commitear `.env`.

### ¿Tests primero?

1. Integración: login, vote, duplicate 409.  
2. Unit: `buildPollResults` porcentajes.  
3. E2E Playwright: flujo admin + user.

### ¿IA y verificación?

IA ayudó en boilerplate y UI; yo revisé integración, probé manualmente auth/roles/CRUD/voto/dashboard y corregí mensajes y polling. Puedo navegar el código y cambiarlo en vivo.

---

## 15. Pitch de 30 segundos

> **PulseVote** es una plataforma de encuestas en tiempo real. Los administradores crean y gestionan encuestas con varias opciones; los usuarios autenticados votan **una sola vez** por encuesta. El backend en Node, Express y Prisma persiste todo en PostgreSQL con una restricción única que evita votos duplicados, incluso bajo concurrencia. El frontend en React consume la API con JWT, protege rutas por rol y muestra un dashboard con métricas y gráficos que se actualizan cada tres segundos mediante polling. Documenté la API con Swagger y dejé el proyecto listo para clonar, levantar con Docker y probar de punta a punta.

---

## Checklist de repaso (antes de la entrevista)

- [ ] Recorrer login → admin CRUD → dashboard polling  
- [ ] Recorrer login user → votar → intentar duplicado  
- [ ] Abrir Swagger y probar login + vote con Bearer  
- [ ] Explicar capas BE y FE sin leer slides  
- [ ] Dibujar modelo User / Poll / Vote en pizarra  
- [ ] Explicar `@@unique` y race condition  
- [ ] Ubicar en código: `auth.middleware.ts`, `vote.service.ts`, `usePolling.ts`  
- [ ] Tener abiertos: `schema.prisma`, `AppRoutes.tsx`, `poll.routes.ts`  
- [ ] Repasar trade-offs (polling, JWT, sin tests E2E)  
- [ ] Preparar 1 cambio en vivo (ej. intervalo polling o bloquear delete con votos)

---

## Errores comunes que debes evitar

| Error | Mejor |
|-------|--------|
| “El voto único solo se valida en frontend” | Siempre mencionar UNIQUE en BD |
| “WebSocket ya está implementado” | Es polling; WS es mejora futura |
| “Cualquier usuario crea encuestas” | Solo ADMIN en BE y FE |
| “El token guarda la contraseña” | Solo userId + role en JWT |
| Inventar endpoints que no existen | Apoyarse en Swagger o `routes/` |
| No saber dónde está un archivo | Practicar: `vote.service.ts`, `AuthContext.tsx` |
| Hablar mal de la IA | “Apoyo + revisión y pruebas manuales” |

---

## Flujo completo simple (login → voto → dashboard)

```text
1. USER/ADMIN → POST /auth/login
2. FE guarda token → Authorization en cada request
3. ADMIN → POST /polls (opciones nested create)
4. USER → GET /polls (todas; hasVoted en lista)
5. USER → POST /polls/:id/vote { optionId }
6. BE valida → INSERT Vote → GET results → responde
7. ADMIN → GET /dashboard/summary + GET /dashboard/polls/:id/results
8. FE usePolling cada 3s refresca gráficos sin recargar página
9. Logout → borra localStorage → rutas privadas redirigen a login
```

---

## Archivos “ancla” para compartir pantalla

| Tema | Archivo |
|------|---------|
| Auth login | `backend/src/services/auth.service.ts` |
| JWT middleware | `backend/src/middlewares/auth.middleware.ts` |
| Roles | `backend/src/middlewares/role.middleware.ts` |
| Voto | `backend/src/services/vote.service.ts` |
| Resultados | `backend/src/services/poll.service.ts` → `buildPollResults` |
| Schema BD | `backend/prisma/schema.prisma` |
| Rutas FE | `frontend/src/routes/AppRoutes.tsx` |
| Sesión FE | `frontend/src/context/AuthContext.tsx` |
| API client | `frontend/src/services/api.ts` |
| Polling | `frontend/src/hooks/usePolling.ts` |
| Dashboard UI | `frontend/src/pages/DashboardPage.tsx` |

---

*Última actualización alineada con el código en `main`. Repasa también [CHECKLIST-ENTREGA.md](./CHECKLIST-ENTREGA.md) y el [README](../README.md).*
