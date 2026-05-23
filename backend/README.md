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
