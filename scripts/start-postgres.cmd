@echo off
cd /d "%~dp0.."
echo Iniciando PostgreSQL con Docker Compose...
docker compose up -d
if errorlevel 1 (
  echo Error. Comprueba que Docker Desktop este en ejecucion.
  exit /b 1
)
echo.
echo PostgreSQL listo en localhost:5433
echo   Usuario: pulsevote_user
echo   Password: pulsevote_password
echo   Base de datos: pulsevote
pause
