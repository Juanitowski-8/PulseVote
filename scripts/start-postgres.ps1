# Levanta PostgreSQL para PulseVote (PowerShell)
# Uso: .\scripts\start-postgres.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Iniciando PostgreSQL con Docker Compose..." -ForegroundColor Cyan
docker compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al iniciar el contenedor. ¿Tienes Docker Desktop en ejecución?" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "PostgreSQL listo en localhost:5433 (5432 ya estaba ocupado en tu PC)" -ForegroundColor Green
Write-Host "  Usuario: pulsevote_user"
Write-Host "  Password: pulsevote_password"
Write-Host "  Base de datos: pulsevote"
Write-Host ""
Write-Host "Siguiente paso (backend):" -ForegroundColor Yellow
Write-Host "  cd backend"
Write-Host "  npm run prisma:migrate"
Write-Host "  npm run prisma:seed"
Write-Host "  npm run dev"
