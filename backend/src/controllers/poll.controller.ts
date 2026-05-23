import type { Request, Response } from 'express'
import { pollService } from '../services/poll.service'
import { asyncHandler } from '../utils/asyncHandler'
import { sendApiSuccess } from '../utils/response'
import { AppError } from '../utils/AppError'
import { getParamId } from '../utils/params'
import type { createPollSchema } from '../schemas/poll.schema'
import type { z } from 'zod'

type PollInput = z.infer<typeof createPollSchema>

export const pollController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('No autenticado', 401, 'UNAUTHORIZED')
    const activeOnly = req.query.active === 'true'
    const polls = await pollService.listPolls(req.user.role, req.user.id, activeOnly)
    sendApiSuccess(res, 'Polls retrieved successfully', polls)
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('No autenticado', 401, 'UNAUTHORIZED')
    const poll = await pollService.getPollById(getParamId(req.params.id), req.user.role, req.user.id)
    sendApiSuccess(res, 'Poll retrieved successfully', poll)
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('No autenticado', 401, 'UNAUTHORIZED')
    const poll = await pollService.createPoll(req.body as PollInput, req.user.id)
    sendApiSuccess(res, 'Poll created successfully', poll, 201)
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('No autenticado', 401, 'UNAUTHORIZED')
    const poll = await pollService.updatePoll(getParamId(req.params.id), req.body as PollInput)
    sendApiSuccess(res, 'Poll updated successfully', poll)
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('No autenticado', 401, 'UNAUTHORIZED')
    await pollService.deletePoll(getParamId(req.params.id))
    sendApiSuccess(res, 'Poll deleted successfully', null)
  }),

  results: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('No autenticado', 401, 'UNAUTHORIZED')
    const results = await pollService.getResults(
      getParamId(req.params.id),
      req.user.role,
      req.user.id,
    )
    sendApiSuccess(res, 'Poll results retrieved successfully', results)
  }),
}
