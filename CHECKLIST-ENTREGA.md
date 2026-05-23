# Checklist de entrega - PulseVote

Lista de verificación para probar el proyecto de forma ordenada (desarrollador y evaluador).  
Guía de instalación detallada: [README.md](README.md).

---

## 1. Setup local

- [ ] Clonar el repositorio (`git clone` + `cd PulseVote`)
- [ ] Levantar Docker / PostgreSQL (`docker compose up -d`)
- [ ] Configurar `backend/.env` (copiar desde `backend/.env.example`)
- [ ] Configurar `frontend/.env` (copiar desde `frontend/.env.example`; `VITE_USE_MOCKS=false`)
- [ ] Instalar dependencias del backend (`cd backend && npm install`)
- [ ] Instalar dependencias del frontend (`cd frontend && npm install`)  
  _(Opcional: `npm install` en la raíz del monorepo)_
- [ ] Ejecutar migraciones (`cd backend && npm run prisma:migrate`)
- [ ] Ejecutar seed (`cd backend && npm run prisma:seed`)
- [ ] Levantar backend (`cd backend && npm run dev`) — **dejar terminal abierta**
- [ ] Verificar health: `GET http://localhost:3000/api/health` → `status: ok`
- [ ] Levantar frontend (`cd frontend && npm run dev`) — **dejar terminal abierta**

> **Nota:** Docker solo levanta PostgreSQL. Backend (3000) y frontend (5173) corren en terminales separadas.

---

## 2. URLs

| Recurso | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| Health | http://localhost:3000/api/health |
| Swagger | http://localhost:3000/api/docs |

---

## 3. Usuarios de prueba (seed)

**Admin**

```text
Email:    admin@pulsevote.app
Password: Admin123!
```

**User**

```text
Email:    user@pulsevote.app
Password: User123!
```

_(Registro adicional disponible en http://localhost:5173/register — rol `USER`.)_

---

## 4. Checklist backend

- [ ] `cd backend && npm run build` — sin errores
- [ ] `cd backend && npm run test` — tests en verde (requiere PostgreSQL + migrate + seed)
- [ ] `/api/health` responde 200 con `service: pulsevote-api`
- [ ] `/api/docs` abre Swagger en el navegador
- [ ] Login admin (`POST /api/auth/login`) devuelve token y rol `ADMIN`
- [ ] Login user devuelve token y rol `USER`
- [ ] Petición protegida sin token o con token inválido → **401** `UNAUTHORIZED`

---

## 5. Checklist frontend

- [ ] `cd frontend && npm run build` — sin errores
- [ ] `cd frontend && npm run test` — tests en verde
- [ ] Landing (`/`) carga correctamente
- [ ] Login (`/login`) carga y envía credenciales al API
- [ ] Tema claro / oscuro funciona y persiste
- [ ] Rutas protegidas redirigen a login si no hay sesión
- [ ] Errores de API se muestran con mensaje legible (alertas / estados de error)

---

## 6. Flujo admin

- [ ] Login con `admin@pulsevote.app` / `Admin123!`
- [ ] Ver dashboard (`/dashboard`) — métricas y gráficas de **sus** encuestas
- [ ] Crear encuesta (`/admin/polls` → Nueva encuesta)
- [ ] Editar encuesta existente
- [ ] Listar encuestas — solo las creadas por ese admin (`createdById`)
- [ ] Ver resultados (icono gráfico o desde dashboard)
- [ ] Desactivar encuesta (icono Power) y/o eliminar encuesta
- [ ] Logout desde el sidebar

---

## 7. Flujo user

- [ ] Login con `user@pulsevote.app` / `User123!`
- [ ] Ver listado de encuestas en `/user/polls` (**todas** las publicadas; votar solo en **activas**)
- [ ] Votar en una encuesta activa (Participar → confirmar)
- [ ] Intentar votar otra vez en la misma encuesta
- [ ] Confirmar bloqueo: mensaje en UI y/o **409** `ALREADY_VOTED` vía API/Swagger
- [ ] Tras votar, la tarjeta muestra “Ya votaste”; listado actualizado
- [ ] Encuesta inactiva visible con botón “Encuesta cerrada” (sin voto)
- [ ] Logout

---

## 8. Seguridad y roles

- [ ] Sin token no accede a rutas privadas del API (**401**)
- [ ] Sin sesión, el frontend no entra a `/admin/polls`, `/user/polls` ni `/dashboard`
- [ ] **USER** no puede crear encuesta (`POST /api/polls` → **403**)
- [ ] **USER** no puede editar encuesta ajena / crear polls (**403** en PUT/DELETE de polls)
- [ ] **USER** no puede eliminar encuestas (**403**)
- [ ] **ADMIN** no puede votar (`POST /api/polls/:id/vote` → **403**)
- [ ] Token inválido o expirado → **401**; frontend redirige a login

---

## 9. Casos límite

| Caso | Cómo probar | Resultado esperado |
|------|-------------|-------------------|
| Encuesta inexistente | `GET /api/polls/id-inventado` con token | **404** `POLL_NOT_FOUND` |
| Voto duplicado | Dos `POST .../vote` mismo user/poll | **409** `ALREADY_VOTED` |
| Opción inválida | Voto con `optionId` de otra encuesta | **400** `INVALID_OPTION` |
| Encuesta inactiva | Voto en poll con `isActive: false` | **400** `POLL_NOT_ACTIVE` |
| Backend apagado | Frontend con API caída | Error de conexión / mensaje amigable |
| DB apagada | Parar Docker o Postgres | API no conecta; revisar logs y `docker compose up -d` |
| Formularios vacíos | Login / registro / crear encuesta sin datos | Validación en frontend; no envía o muestra error |

**Voto único (doble capa):**

- [ ] Lógica en `vote.service.ts` comprueba voto previo
- [ ] Restricción Prisma `@@unique([userId, pollId])` en base de datos

---

## 10. Tests y builds (resumen)

**Backend**

```bash
docker compose up -d
cd backend
npm run prisma:migrate
npm run prisma:seed
npm run build
npm run test
```

**Frontend**

```bash
cd frontend
npm run build
npm run test
```

- [ ] Builds OK
- [ ] Tests OK

---

## 11. Resultado esperado

Marcar al cerrar la entrega:

- [ ] Proyecto listo para entrega (flujos admin y user verificados)
- [ ] [README.md](README.md) revisado y al día
- [ ] Commits subidos al repositorio remoto
- [ ] Repositorio público (o acceso concedido al evaluador)
- [ ] Correo / enlace de entrega enviado

---

**PulseVote** · [README.md](README.md) · [GUIA-ENTREVISTA.md](GUIA-ENTREVISTA.md)
