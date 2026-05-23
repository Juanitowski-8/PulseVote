# Checklist de entrega técnica — PulseVote

Usar este documento para validar el proyecto de punta a punta antes de la demo o evaluación.

## Requisitos previos

- [ ] Docker Desktop en ejecución
- [ ] Node.js 18+ instalado
- [ ] Puertos libres: **3000** (API), **5173** (frontend), **5433** (PostgreSQL)

## 1. Base de datos

```powershell
cd C:\ruta\PulseVote
docker compose up -d
```

- [ ] Contenedor `pulsevote-postgres` en estado **Up**
- [ ] Puerto **5433** accesible

## 2. Backend

```powershell
cd backend
copy .env.example .env   # si no existe .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run build
npm run dev
```

Verificar:

- [ ] `npm run build` sin errores
- [ ] Consola: `PulseVote API en http://localhost:3000`
- [ ] `GET http://localhost:3000/api/health` → `{ "status": "ok", "service": "pulsevote-api" }`
- [ ] `http://localhost:3000/api/docs` carga Swagger
- [ ] Seed muestra credenciales admin/user

## 3. Frontend

```powershell
cd frontend
copy .env.example .env   # si no existe .env
npm install
npm run build
npm run dev
```

En `.env`:

```
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCKS=false
```

Verificar:

- [ ] `npm run build` sin errores (warning de chunk >500 kB es aceptable)
- [ ] App en `http://localhost:5173`
- [ ] Sin errores rojos en consola del navegador (F12)
- [ ] Peticiones van a `localhost:3000/api` (pestaña Network)

---

## 4. Flujo ADMIN

**Credenciales:** `admin@pulsevote.app` / `Admin123!`

| # | Caso | OK |
|---|------|----|
| 1 | Login desde landing o `/login` | [ ] |
| 2 | Redirige a `/admin/polls` | [ ] |
| 3 | Lista encuestas del seed | [ ] |
| 4 | Crear encuesta (2+ opciones, pregunta obligatoria) | [ ] |
| 5 | Editar encuesta existente | [ ] |
| 6 | Activar / desactivar encuesta | [ ] |
| 7 | Ver resultados (icono gráfico → dashboard con `?poll=id`) | [ ] |
| 8 | Eliminar encuesta (confirmación) | [ ] |
| 9 | Dashboard: métricas visibles | [ ] |
| 10 | Dashboard: gráfica y tabla de resultados | [ ] |
| 11 | Dashboard: datos se actualizan ~cada 3 s sin parpadeo total | [ ] |
| 12 | Logout → vuelve a login, rutas privadas bloqueadas | [ ] |

---

## 5. Flujo USER

**Credenciales:** `user@pulsevote.app` / `User123!`

| # | Caso | OK |
|---|------|----|
| 1 | Login → redirige a `/user/polls` | [ ] |
| 2 | Solo encuestas **activas** | [ ] |
| 3 | Votar sin opción → mensaje de validación | [ ] |
| 4 | Votar con opción → éxito y badge “Ya votaste” | [ ] |
| 5 | Intentar votar de nuevo → mensaje claro (409) | [ ] |
| 6 | `/admin/polls` o `/dashboard` → redirige a `/user/polls` | [ ] |
| 7 | Logout funciona | [ ] |

---

## 6. Seguridad y roles

| # | Caso | OK |
|---|------|----|
| 1 | Sin login, `/admin/polls` → `/login` | [ ] |
| 2 | USER no puede crear/editar/eliminar (API 403 si se fuerza) | [ ] |
| 3 | ADMIN no puede votar (API 403) | [ ] |
| 4 | Token inválido en API → 401 | [ ] |
| 5 | Recargar página mantiene sesión (`/auth/me`) | [ ] |

---

## 7. Errores y validación

| # | Caso | OK |
|---|------|----|
| 1 | Backend apagado → mensaje de conexión en UI | [ ] |
| 2 | Login incorrecto → mensaje claro (no JSON crudo) | [ ] |
| 3 | Formulario encuesta vacío → no envía, mensajes en campos | [ ] |
| 4 | Voto duplicado → texto en español | [ ] |

---

## 8. Diseño y UX

| # | Caso | OK |
|---|------|----|
| 1 | Landing legible (hero, CTAs, preview dashboard) | [ ] |
| 2 | Login legible (card oscura, inputs visibles) | [ ] |
| 3 | App admin/user legible en modo oscuro | [ ] |
| 4 | Responsive móvil aceptable (sidebar, cards) | [ ] |
| 5 | Sin referencias visibles a “Verdicta” | [ ] |
| 6 | Logo PulseVote en navbar / sidebar | [ ] |

---

## 9. Repositorio

| # | Caso | OK |
|---|------|----|
| 1 | `.env` no está en git | [ ] |
| 2 | `.env.example` en backend y frontend | [ ] |
| 3 | README raíz con instrucciones | [ ] |
| 4 | Historial con commits incrementales (no un solo commit) | [ ] |
| 5 | Repo público accesible | [ ] |

---

## URLs de referencia

| Recurso | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API health | http://localhost:3000/api/health |
| Swagger | http://localhost:3000/api/docs |
| GitHub | https://github.com/Juanitowski-8/PulseVote |

## Credenciales seed

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@pulsevote.app | Admin123! |
| User | user@pulsevote.app | User123! |
