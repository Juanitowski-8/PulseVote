import type { NextFunction, Request, Response } from 'express'
import type { Role } from '@prisma/client'
import { AppError } from '../utils/AppError'

/**
 * Restringe rutas a uno o más roles.
 * Uso: authorizeRoles('ADMIN') o authorizeRoles('ADMIN', 'USER')
 */
export function authorizeRoles(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('No autenticado', 401, 'UNAUTHORIZED'))
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('No tienes permiso para esta acción', 403, 'FORBIDDEN'))
    }

    next()
  }
}
