import type { Response } from 'express'

/** Respuesta estándar para endpoints de autenticación. */
export function sendAuthSuccess<T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200,
) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  res.status(statusCode).json(data)
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
) {
  res.status(statusCode).json({
    success: false,
    error: { code, message },
  })
}
