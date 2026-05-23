import type { Request, Response } from 'express'
import { voteService } from '../services/vote.service'
import { asyncHandler } from '../utils/asyncHandler'
import { AppError } from '../utils/AppError'
import { getParamId } from '../utils/params'

export const voteController = {
  vote: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('No autenticado', 401, 'UNAUTHORIZED')
    const { optionId } = req.body as { optionId: string }
    await voteService.castVote(req.user.id, getParamId(req.params.id), optionId)
    res.status(201).json({ message: 'Voto registrado correctamente' })
  }),
}
