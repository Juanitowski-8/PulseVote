import type { Request, Response } from 'express'
import { dashboardService } from '../services/dashboard.service'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/response'
import { getParamId } from '../utils/params'
export const dashboardController = {
  summary: asyncHandler(async (_req: Request, res: Response) => {
    const summary = await dashboardService.getSummary()
    sendSuccess(res, summary)
  }),

  pollResults: asyncHandler(async (req: Request, res: Response) => {
    const results = await dashboardService.getPollResults(getParamId(req.params.id))
    sendSuccess(res, results)
  }),
}
