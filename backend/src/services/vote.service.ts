import { prisma } from '../config/prisma'
import { AppError } from '../utils/AppError'

export const voteService = {
  async castVote(userId: string, pollId: string, optionId: string) {
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    })

    if (!poll) {
      throw new AppError('Encuesta no encontrada', 404, 'POLL_NOT_FOUND')
    }

    if (!poll.isActive) {
      throw new AppError('La encuesta no está activa', 400, 'POLL_NOT_ACTIVE')
    }

    const option = poll.options.find((o) => o.id === optionId)
    if (!option) {
      throw new AppError('La opción no pertenece a esta encuesta', 400, 'INVALID_OPTION')
    }

    const existingVote = await prisma.vote.findUnique({
      where: { userId_pollId: { userId, pollId } },
    })

    if (existingVote) {
      throw new AppError('Ya has votado en esta encuesta', 409, 'ALREADY_VOTED')
    }

    try {
      await prisma.vote.create({
        data: { userId, pollId, optionId },
      })
    } catch {
      throw new AppError('Ya has votado en esta encuesta', 409, 'ALREADY_VOTED')
    }
  },
}
