# PulseVote API

REST API para encuestas en tiempo real.

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Configuración

```bash
cp .env.example .env
# Edita DATABASE_URL, JWT_SECRET, etc.
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor en modo desarrollo (tsx watch) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta build de producción |
| `npm run prisma:generate` | Genera Prisma Client |
| `npm run prisma:migrate` | Aplica migraciones |
| `npm run prisma:seed` | Datos iniciales |
| `npm run test` | Tests de integración (Vitest + Supertest) |
| `npm run test:watch` | Tests en modo watch |

## Tests automatizados

Suite de **integración** contra la API real (sin levantar `server.ts`).

**Requisitos:**

1. PostgreSQL activo (Docker Compose en puerto **5433**).
2. `npm run prisma:migrate` y `npm run prisma:seed` ejecutados.
3. `.env` con `DATABASE_URL` y `JWT_SECRET` válidos.

```bash
cd backend
npm install
npm run test
```

**Cubre:** health, register, login admin/user, admin solo ve sus polls, user ve todas, 401 sin token, crear poll (admin), 403 user crea poll, voto único, 409 duplicado, 403 admin vota.

Los polls de prueba usan el prefijo `[TEST]` y se eliminan al finalizar la suite.

## Usuarios de prueba (seed)

| Rol | Email | Contraseña |
|-----|-------|------------|
| ADMIN | admin@pulsevote.app | Admin123! |
| USER | user@pulsevote.app | User123! |

## Health check

`GET http://localhost:3000/api/health`

## Swagger / OpenAPI

Documentación interactiva (prueba técnica):

**URL:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

1. Abre `/api/docs` en el navegador.
2. **POST /auth/login** con `admin@pulsevote.app` / `Admin123!` (o user).
3. Copia `data.token` de la respuesta.
4. Clic en **Authorize** (candado), pega el token (sin prefijo `Bearer`).
5. Prueba rutas protegidas (polls, vote, dashboard).

Tags: Auth, Polls, Votes, Dashboard, Health.

## Votación — `POST /api/polls/:id/vote`

Solo rol **USER**. Body: `{ "optionId": "<id-opcion>" }`.

```bash
# 1) Login USER
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@pulsevote.app\",\"password\":\"User123!\"}"

# 2) Listar encuestas activas (copiar poll id y option id)
curl -s http://localhost:3000/api/polls \
  -H "Authorization: Bearer <TOKEN>"

# 3) Votar
curl -s -X POST http://localhost:3000/api/polls/<POLL_ID>/vote \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"optionId\":\"<OPTION_ID>\"}"
```

| Caso | HTTP | Código |
|------|------|--------|
| Voto correcto | 201 | — |
| Sin token | 401 | `UNAUTHORIZED` |
| ADMIN vota | 403 | `FORBIDDEN` |
| `optionId` vacío | 400 | `VALIDATION_ERROR` |
| Poll inexistente | 404 | `POLL_NOT_FOUND` |
| Poll inactiva | 400 | `POLL_NOT_ACTIVE` |
| Opción de otra encuesta | 400 | `INVALID_OPTION` |
| Segundo voto misma encuesta | 409 | `ALREADY_VOTED` |

## Dashboard

Requiere `Authorization: Bearer <token>`. Roles: **ADMIN** y **USER**.

```bash
# Resumen (métricas según rol)
curl -s http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer <TOKEN>"

# Resultados agregados de una encuesta (polling cada 3s en el frontend)
curl -s http://localhost:3000/api/dashboard/polls/<POLL_ID>/results \
  -H "Authorization: Bearer <TOKEN>"
```

Respuesta: `{ "success": true, "data": { ... } }`. Sin datos sensibles (`passwordHash`, etc.).
