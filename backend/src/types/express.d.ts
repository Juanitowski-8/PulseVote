import type { AuthUser } from './auth.types'

declare global {
  namespace Express {
    interface Request {
      /** Usuario autenticado (sin passwordHash), adjuntado por authenticate. */
      user?: AuthUser
    }
  }
}

export {}
