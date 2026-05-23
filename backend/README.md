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

## Usuarios de prueba (seed)

| Rol | Email | Contraseña |
|-----|-------|------------|
| ADMIN | admin@pulsevote.app | Admin123! |
| USER | user@pulsevote.app | User123! |

## Health check

`GET http://localhost:3000/api/health`

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
