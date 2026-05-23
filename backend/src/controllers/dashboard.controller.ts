import type { Request, Response } from 'express'
import { dashboardService } from '../services/dashboard.service'
import { asyncHandler } from '../utils/asyncHandler'
import { AppError } from '../utils/AppError'
import { getParamId } from '../utils/params'
import { sendDataSuccess } from '../utils/response'

export const dashboardController = {
  summary: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
    }

    const data = await dashboardService.getSummary(req.user.role, req.user.id)
    sendDataSuccess(res, data)
  }),

  pollResults: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
    }

    const data = await dashboardService.getPollResults(getParamId(req.params.id))
    sendDataSuccess(res, data)
  }),
}
