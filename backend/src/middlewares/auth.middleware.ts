import type { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { authService } from '../services/auth.service'
import { AppError } from '../utils/AppError'
import { asyncHandler } from '../utils/asyncHandler'
import { verifyToken } from '../utils/jwt'

async function authenticateHandler(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Token no proporcionado', 401, 'UNAUTHORIZED')
  }

  const token = header.slice(7).trim()

  if (!token) {
    throw new AppError('Token no proporcionado', 401, 'UNAUTHORIZED')
  }

  try {
    const payload = verifyToken(token)
    req.user = await authService.findUserById(payload.userId)
    next()
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    if (error instanceof TokenExpiredError) {
      throw new AppError('Token expirado', 401, 'UNAUTHORIZED')
    }
    if (error instanceof JsonWebTokenError) {
      throw new AppError('Token inválido', 401, 'UNAUTHORIZED')
    }
    throw new AppError('No autenticado', 401, 'UNAUTHORIZED')
  }
}

/**
 * Valida JWT del header Authorization y adjunta el usuario a req.user.
 * El usuario se carga desde BD para reflejar el estado actual (rol, email, etc.).
 */
export const authenticate = asyncHandler(authenticateHandler)
