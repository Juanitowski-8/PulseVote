import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma'
import { pollService } from './poll.service'
import { AppError } from '../utils/AppError'
import type { CastVoteResult } from '../types/vote.types'

/**
 * Registra un voto con validaciones de negocio.
 *
 * Doble protección contra voto duplicado:
 * 1) findUnique por @@unique([userId, pollId]) antes de crear.
 * 2) unique en BD + captura de P2002 si hay condición de carrera.
 */
export const voteService = {
  async castVote(userId: string, pollId: string, optionId: string): Promise<CastVoteResult> {
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: { select: { id: true } },
      },
    })

    if (!poll) {
      throw new AppError('Poll not found', 404, 'POLL_NOT_FOUND')
    }

    if (!poll.isActive) {
      throw new AppError('Poll is not active', 400, 'POLL_NOT_ACTIVE')
    }

    const optionBelongsToPoll = poll.options.some((o) => o.id === optionId)
    if (!optionBelongsToPoll) {
      throw new AppError('Option does not belong to this poll', 400, 'INVALID_OPTION')
    }

    const existingVote = await prisma.vote.findUnique({
      where: { userId_pollId: { userId, pollId } },
    })

    if (existingVote) {
      throw new AppError('You have already voted in this poll', 409, 'ALREADY_VOTED')
    }

    let vote
    try {
      vote = await prisma.vote.create({
        data: { userId, pollId, optionId },
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AppError('You have already voted in this poll', 409, 'ALREADY_VOTED')
      }
      throw error
    }

    const results = await pollService.getPollResults(pollId)

    return {
      vote: {
        id: vote.id,
        userId: vote.userId,
        pollId: vote.pollId,
        optionId: vote.optionId,
        createdAt: vote.createdAt,
      },
      results,
    }
  },
}
