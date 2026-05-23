import { prisma } from '../config/prisma'
import { AppError } from '../utils/AppError'
import type { DashboardSummary } from '../types/poll.types'
import { pollService } from './poll.service'

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const [pollCount, voteCount, activeCount, polls] = await Promise.all([
      prisma.poll.count(),
      prisma.vote.count(),
      prisma.poll.count({ where: { isActive: true } }),
      prisma.poll.findMany({
        include: { _count: { select: { votes: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
    ])

    const averageParticipation =
      pollCount === 0 ? 0 : Math.round(voteCount / pollCount)

    return {
      totalPolls: pollCount,
      totalVotes: voteCount,
      activePolls: activeCount,
      averageParticipation,
      polls: polls.map((p) => ({
        id: p.id,
        question: p.question,
        isActive: p.isActive,
        totalVotes: p._count.votes,
        updatedAt: p.updatedAt,
      })),
      updatedAt: new Date(),
    }
  },

  async getPollResults(pollId: string) {
    const poll = await prisma.poll.findUnique({ where: { id: pollId } })
    if (!poll) {
      throw new AppError('Encuesta no encontrada', 404, 'POLL_NOT_FOUND')
    }
    return pollService.getResultsAdmin(pollId)
  },
}
