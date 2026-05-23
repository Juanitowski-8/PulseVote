import type { NextFunction, Request, Response } from 'express'

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>

/** Evita try/catch repetitivo en controllers; errores van al middleware global. */
export const asyncHandler =
  (fn: AsyncController) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
