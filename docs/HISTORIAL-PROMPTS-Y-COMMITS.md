# Historial de prompts, cambios y commits — PulseVote

Documento para **revisión en empresa**: relaciona las solicitudes (prompts) del desarrollo con el trabajo realizado y los **commits en Git** del repositorio público.

**Repositorio:** https://github.com/Juanitowski-8/PulseVote  
**Rama principal:** `main`  
**Autor de commits:** desarrollo asistido con Cursor (IA) + revisión y pruebas manuales del autor.

---

## Cómo leer este documento

| Columna | Significado |
|---------|-------------|
| **#** | Orden aproximado de la solicitud |
| **Prompt / solicitud** | Resumen de lo pedido (no texto literal completo) |
| **Cambios realizados** | Qué se implementó o corrigió |
| **Commit(s)** | Hash corto y mensaje en `git log` |
| **Área** | `frontend` · `backend` · `docs` · `chore` |

Para ver el detalle de un commit:

```bash
git show <hash>
git log --oneline --reverse
```

---

## Fase 0 — Base del proyecto (antes / inicio del repo)

| # | Prompt / solicitud | Cambios realizados | Commit(s) | Área |
|---|-------------------|-------------------|-----------|------|
| 0 | Proyecto inicial PulseVote (monorepo) | Frontend React + backend Express + Prisma + Docker PostgreSQL + auth + CRUD encuestas + mocks | `dbfe7cb` feat: PulseVote monorepo inicial… | full |
| 0b | Landing explicativa | Páginas welcome, flujo admin/user, preview | `c360df3` | frontend |
| 0c | Modo día / noche | ThemeToggle, ThemeContext | `d5d493c` | frontend |
| 0d | Estética Daybreak / verde | Paleta oscura, componentes | `54900f7`, `9101f76` | frontend |
| 0e | Documentar estado | `docs/ESTADO-SISTEMA.md` | `8f2499c`, `505ee8e` | docs |

---

## Fase 1 — Branding, UI landing y flujo Git

| # | Prompt / solicitud | Cambios realizados | Commit(s) | Área |
|---|-------------------|-------------------|-----------|------|
| 1 | Comprender `docs/ESTADO-SISTEMA.md` en totalidad | Lectura y alineación con el plan del sistema (sin commit dedicado) | — | docs |
| 2 | Logo minimalista tipo encuesta + fondo con movimiento futurista | `PulseVoteLogo`, favicon, animaciones landing, fondo animado | `318166c`, `2d424b6` | frontend |
| 3 | Hacer **commit después de cada acción** (solo había ~7 commits visibles) | Varios commits locales + push a GitHub | Varios entre `318166c`–`ee6c2fd` | chore |
| 4 | Commits y **push siempre** a `github.com/Juanitowski-8/PulseVote` | Regla `.cursor/rules/git-github.mdc`, remoto `origin` | `a0a4924` | chore |
| 5 | Logo más minimalista; fondo como imagen de referencia | Ajuste logo SVG; fondos LED / auroras | `2d424b6`, `9249152` | frontend |
| 6 | Fondo neon premium con movimiento | Efectos glow, gradientes, animaciones CSS | `9249152` | frontend |
| 7 | Fondo sigue negro — no gusta | Fondo verde luminoso | `e747e6c` | frontend |
| 8 | Fondo tipo galaxia neon | `LandingAmbient` / efectos neón ampliados | `ee6c2fd` | frontend |
| 9 | Landing premium SaaS (iteración anterior) | Hero, cards, paleta | `894000a`, `f3b318a` | frontend |

---

## Fase 2 — Backend: votación y dashboard

| # | Prompt / solicitud | Cambios realizados | Commit(s) | Área |
|---|-------------------|-------------------|-----------|------|
| 10 | **Módulo de votación** completo: `POST /api/polls/:id/vote`, validaciones, 409 duplicado, solo USER, resultados en respuesta | `vote.service.ts`, `vote.routes.ts`, `vote.schema.ts`, unique BD `@@unique([userId,pollId])` | `25b741f` | backend |
| 11 | **Dashboard backend**: `GET /dashboard/summary`, `GET /dashboard/polls/:id/results`, métricas ADMIN vs USER | `dashboard.service.ts`, rutas, tipos, agregación porcentajes | `03b31d0` | backend |

---

## Fase 3 — Landing premium, navbar, Swagger

| # | Prompt / solicitud | Cambios realizados | Commit(s) | Área |
|---|-------------------|-------------------|-----------|------|
| 12 | Mejorar **solo el fondo** landing: oscuro premium, verdes suaves, sin rehacer lógica | `AnimatedPremiumBackground.tsx`, paleta `#020D0A`, utilidades CSS | `e880294` | frontend |
| 13 | Hacer **navbar más grande** (logo, links, CTAs) | `WelcomeNavbar.tsx` altura y tipografía | `9aec91d` | frontend |
| 14 | Tras cada prompt: **verificar, build, commit, push** | Regla ampliada en `.cursor/rules/git-github.mdc` | `f959749` | chore |
| 15 | **Swagger/OpenAPI** en `GET /api/docs` | swagger-jsdoc, paths/schemas, montaje en `app.ts` | `d443475` | backend |

---

## Fase 4 — Integración frontend ↔ backend

| # | Prompt / solicitud | Cambios realizados | Commit(s) | Área |
|---|-------------------|-------------------|-----------|------|
| 16 | **Conectar frontend al backend real** (`VITE_USE_MOCKS=false`, envelope, auth, polls, vote, dashboard) | `api.ts`, `authService`, `pollService`, `AuthContext`, `.env.example`, keys `pulsevote_*` | `7eb0c3b` | frontend |
| 17 | **Revisión integración** FE-BE: credenciales, errores, polling, envelope, sin Verdicta en UI | `getErrorMessage`, `usePolling` estable, migración storage, `mockStore` | `7c67b72` | frontend |

*Nota: el usuario pidió commit con mensaje `fix: align frontend backend integration…`; el cambio quedó registrado en `7c67b72` con mensaje en español (mismo contenido).*

---

## Fase 5 — Rediseño UI, QA final y documentación de entrega

| # | Prompt / solicitud | Cambios realizados | Commit(s) | Área |
|---|-------------------|-------------------|-----------|------|
| 18 | **Rediseño visual premium**: menos glow, más contraste, paleta oficial, hero 2 columnas, componentes base | `index.css`, landing, login, UI kit, `design-tokens.ts` | `ea587da` | frontend |
| 19 | **Revisión final** pre-entrega: builds, smoke API, checklist, errores ES en backend | `CHECKLIST-ENTREGA.md`, mensajes vote en español, limpieza componentes muertos | `00b701b` | docs/backend |
| 20 | **README profesional** raíz para evaluadores | `README.md` completo (setup, endpoints, decisiones) | `f6cf1e3` | docs |
| 21 | **Guía de entrevista técnica** | `docs/GUIA-ENTREVISTA.md` | `2bf7bab` | docs |

*Commits pedidos por el usuario sin cambios pendientes (árbol ya limpio):*  
`fix: align frontend…`, `style: polish premium…`, `test: complete final QA…`, `docs: add swagger…`, etc. → el trabajo ya estaba en los commits anteriores de la tabla.

---

## Listado completo de commits (orden cronológico)

```
dbfe7cb feat: PulseVote monorepo inicial con frontend y backend completos
c360df3 feat(frontend): landing explicativa con flujo admin, usuario y preview en vivo
d5d493c feat(frontend): toggle modo día/nocturno fijo en esquina inferior izquierda
54900f7 feat(frontend): modo oscuro estilo OpenAI Daybreak con paleta verde
9101f76 feat(frontend): fondo animado premium con estética verde LED en modo oscuro
8f2499c docs: estado actual del sistema y pendientes para consultas futuras
5f330f5 docs: enlace a ESTADO-SISTEMA en README raíz
894000a feat(frontend): landing premium SaaS, logo PulseVote y fondo minimalista
f3b318a fix(frontend): logo PulseVote más legible (pulse, voto y resultados)
505ee8e docs: actualización integral de ESTADO-SISTEMA (mayo 2026)
318166c feat(frontend): logo minimalista de encuesta y fondo landing futurista animado
a0a4924 chore: regla Cursor para commit y push a GitHub PulseVote
2d424b6 feat(frontend): logo ultra minimalista y fondo landing con auroras y grain
9249152 feat(frontend): fondo neon premium con movimiento fluido estilo referencia
e747e6c fix(frontend): fondo verde neon luminoso en lugar de negro plano
ee6c2fd feat(frontend): fondo galaxia neon premium con estrellas y nebulosas animadas
25b741f feat(backend): módulo de votación completo con resultados y validaciones
03b31d0 feat(backend): dashboard con métricas por rol y resultados para polling
e880294 feat(frontend): fondo premium animado en landing con paleta PulseVote
9aec91d feat(frontend): navbar landing más grande (logo, links y CTAs)
f959749 chore: regla git — verificar builds antes de commit y push
d443475 feat(backend): documentación Swagger OpenAPI en /api/docs
7eb0c3b feat(frontend): integración completa con API real y envelope del backend
7c67b72 fix(frontend): errores amigables, polling estable y keys pulsevote
ea587da feat(frontend): rediseño visual premium PulseVote — legibilidad y tokens
00b701b fix(backend): mensajes de error en español y checklist de entrega
f6cf1e3 docs: README profesional completo para entrega y evaluación
2bf7bab docs: guía de entrevista técnica para PulseVote
```

---

## Uso de IA (transparencia para revisión)

- **Herramienta:** Cursor (asistente IA).
- **Uso:** generación de estructura, componentes UI, integración API, documentación y commits frecuentes según prompts.
- **Responsabilidad del autor:** revisión de código, pruebas manuales (auth, roles, CRUD, voto 409, dashboard, Swagger), ajustes de mensajes, builds y push a GitHub.
- **Evidencia en repo:** historial de commits incremental (no un solo commit masivo), documentación en `/docs` y README reproducible.

---

## Documentos relacionados

| Archivo | Contenido |
|---------|-----------|
| [README.md](../README.md) | Cómo clonar y ejecutar |
| [CHECKLIST-ENTREGA.md](./CHECKLIST-ENTREGA.md) | Pruebas manuales |
| [GUIA-ENTREVISTA.md](./GUIA-ENTREVISTA.md) | Defensa técnica en entrevista |
| [ESTADO-SISTEMA.md](./ESTADO-SISTEMA.md) | Estado técnico detallado |

---

*Generado para auditoría de commits y trazabilidad prompt → cambio → commit. Última actualización: alineado con `main` en commit `2bf7bab`.*
