import type { Response } from 'express'

/** Respuesta estándar `{ success, message, data }` para toda la API. */
export function sendApiSuccess<T>(
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

/** Alias histórico (auth); mismo contrato que sendApiSuccess. */
export function sendAuthSuccess<T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200,
) {
  sendApiSuccess(res, message, data, statusCode)
}

/** Respuesta estándar del dashboard `{ success, data }` (sin message). */
export function sendDataSuccess<T>(res: Response, data: T, statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    data,
  })
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
) {
  res.status(statusCode).json({
    success: false,
    message,
    error: { code, message },
  })
}
