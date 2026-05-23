import type { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { asyncHandler } from '../utils/asyncHandler'
import { sendAuthSuccess } from '../utils/response'
import { AppError } from '../utils/AppError'
import type { LoginInput } from '../schemas/auth.schema'

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginInput
    const result = await authService.login(email, password)

    sendAuthSuccess(res, 'Login successful', result, 200)
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('No autenticado', 401, 'UNAUTHORIZED')
    }

    sendAuthSuccess(res, 'User retrieved successfully', req.user)
  }),
}
