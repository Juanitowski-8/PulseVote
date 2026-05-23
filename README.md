# PulseVote

Encuestas en tiempo real — monorepo frontend + backend.

📋 **Estado detallado del proyecto:** [docs/ESTADO-SISTEMA.md](docs/ESTADO-SISTEMA.md)

## Terminal en Windows (PowerShell)

**No uses `\` al final de línea** (eso es de Linux/bash). En PowerShell:

- **Una sola línea**, o
- **Backtick** `` ` `` para continuar:

```powershell
docker run --name pulsevote-postgres `
  -e POSTGRES_USER=pulsevote_user `
  -e POSTGRES_PASSWORD=pulsevote_password `
  -e POSTGRES_DB=pulsevote `
  -p 5433:5432 `
  -d postgres:16
```

**Recomendado:** Docker Compose (desde la raíz del proyecto):

```powershell
cd C:\Users\Juane\Downloads\PulseVote
docker compose up -d
```

O el script:

```powershell
.\scripts\start-postgres.ps1
```

PostgreSQL queda en **puerto 5433** (el 5432 suele estar ocupado por otra instancia).

## Backend

```powershell
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

## Usuarios de prueba (seed)

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@pulsevote.app | Admin123! |
| User | user@pulsevote.app | User123! |
