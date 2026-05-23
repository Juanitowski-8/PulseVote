import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { AppError } from '../utils/AppError'
import { sendError } from '../utils/response'

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    // Mensajes genéricos en auth; sin filtrar si el email existe o no
    return sendError(res, err.statusCode, err.code, err.message)
  }

  if (err instanceof ZodError) {
    const message = err.issues.map((e) => e.message).join(', ')
    return sendError(res, 400, 'VALIDATION_ERROR', message)
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const targets = err.meta?.target
      const isPollVoteUnique =
        Array.isArray(targets) &&
        targets.includes('userId') &&
        targets.includes('pollId')

      if (isPollVoteUnique) {
        return sendError(
          res,
          409,
          'ALREADY_VOTED',
          'You have already voted in this poll',
        )
      }

      return sendError(res, 409, 'DUPLICATE_ENTRY', 'Resource already exists')
    }
    if (err.code === 'P2025') {
      return sendError(res, 404, 'NOT_FOUND', 'Recurso no encontrado')
    }
  }

  console.error('Unhandled error:', err)
  return sendError(res, 500, 'INTERNAL_ERROR', 'Error interno del servidor')
}
