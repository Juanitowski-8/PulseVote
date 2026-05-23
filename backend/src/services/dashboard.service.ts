import type { Role } from '@prisma/client'
import { prisma } from '../config/prisma'
import { AppError } from '../utils/AppError'
import type {
  AdminDashboardSummary,
  DashboardPollResults,
  UserDashboardSummary,
} from '../types/dashboard.types'
import { pollService } from './poll.service'

const LIST_LIMIT = 5

const pollListSelect = {
  id: true,
  question: true,
  isActive: true,
  createdAt: true,
  _count: { select: { votes: true } },
} as const

function mapPollListItem(
  p: {
    id: string
    question: string
    isActive: boolean
    createdAt: Date
    _count: { votes: number }
  },
) {
  return {
    id: p.id,
    question: p.question,
    isActive: p.isActive,
    createdAt: p.createdAt,
    totalVotes: p._count.votes,
  }
}

function averageVotesPerPoll(totalVotes: number, totalPolls: number): number {
  if (totalPolls === 0) return 0
  return Math.round((totalVotes / totalPolls) * 10) / 10
}

async function getAdminSummary(adminUserId: string): Promise<AdminDashboardSummary> {
  const ownPollWhere = { createdById: adminUserId }

  const [totalPolls, activePolls, allPolls, voteAgg, voterRows] = await Promise.all([
    prisma.poll.count({ where: ownPollWhere }),
    prisma.poll.count({ where: { ...ownPollWhere, isActive: true } }),
    prisma.poll.findMany({
      where: ownPollWhere,
      select: pollListSelect,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.vote.aggregate({
      where: { poll: ownPollWhere },
      _count: { _all: true },
    }),
    prisma.vote.findMany({
      where: { poll: ownPollWhere },
      select: { userId: true },
      distinct: ['userId'],
    }),
  ])

  const totalVotes = voteAgg._count._all
  const totalUsers = voterRows.length

  const inactivePolls = totalPolls - activePolls

  const latestPolls = [...allPolls]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, LIST_LIMIT)
    .map(mapPollListItem)

  const mostVotedPolls = [...allPolls]
    .sort((a, b) => b._count.votes - a._count.votes)
    .slice(0, LIST_LIMIT)
    .map((p) => ({
      id: p.id,
      question: p.question,
      totalVotes: p._count.votes,
    }))

  return {
    totalPolls,
    activePolls,
    inactivePolls,
    totalVotes,
    totalUsers,
    averageParticipation: averageVotesPerPoll(totalVotes, totalPolls),
    latestPolls,
    mostVotedPolls,
    polls: allPolls.map(mapPollListItem),
  }
}

async function getUserSummary(userId: string): Promise<UserDashboardSummary> {
  const [activePolls, pollsVotedByUser, totalVotes, activePollRows, userVotes] =
    await Promise.all([
      prisma.poll.count({ where: { isActive: true } }),
      prisma.vote.count({ where: { userId } }),
      prisma.vote.count(),
      prisma.poll.findMany({
        where: { isActive: true },
        select: pollListSelect,
        orderBy: { createdAt: 'desc' },
        take: LIST_LIMIT,
      }),
      prisma.vote.findMany({
        where: { userId },
        select: { pollId: true },
      }),
    ])

  const votedPollIds = new Set(userVotes.map((v) => v.pollId))
  const pendingPolls = await prisma.poll.count({
    where: {
      isActive: true,
      ...(votedPollIds.size > 0 ? { id: { notIn: [...votedPollIds] } } : {}),
    },
  })

  const latestActivePolls = activePollRows.map((p) => ({
    id: p.id,
    question: p.question,
    hasVoted: votedPollIds.has(p.id),
    createdAt: p.createdAt,
  }))

  return {
    activePolls,
    pollsVotedByUser,
    pendingPolls,
    totalVotes,
    latestActivePolls,
  }
}

export const dashboardService = {
  async getSummary(role: Role, userId: string) {
    if (role === 'ADMIN') {
      return getAdminSummary(userId)
    }
    return getUserSummary(userId)
  },

  async getPollResults(
    pollId: string,
    role: Role,
    userId: string,
  ): Promise<DashboardPollResults> {
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      select: { id: true, createdById: true },
    })

    if (!poll) {
      throw new AppError('Encuesta no encontrada', 404, 'POLL_NOT_FOUND')
    }

    if (role === 'ADMIN' && poll.createdById !== userId) {
      throw new AppError('No autorizado', 403, 'FORBIDDEN')
    }

    const results = await pollService.getPollResults(pollId)

    return {
      ...results,
      generatedAt: new Date(),
    }
  },
}
