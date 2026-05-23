import type { Role } from '@prisma/client'
import { prisma } from '../config/prisma'
import { AppError } from '../utils/AppError'
import type { PollResults } from '../types/poll.types'
import type { createPollSchema } from '../schemas/poll.schema'
import type { z } from 'zod'

type CreatePollInput = z.infer<typeof createPollSchema>
type UpdatePollInput = CreatePollInput

async function buildPollResults(pollId: string): Promise<PollResults> {
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      options: {
        include: { _count: { select: { votes: true } } },
      },
      _count: { select: { votes: true } },
    },
  })

  if (!poll) {
    throw new AppError('Encuesta no encontrada', 404, 'POLL_NOT_FOUND')
  }

  const totalVotes = poll._count.votes

  return {
    pollId: poll.id,
    question: poll.question,
    description: poll.description,
    isActive: poll.isActive,
    totalVotes,
    updatedAt: poll.updatedAt,
    options: poll.options.map((opt) => ({
      optionId: opt.id,
      text: opt.text,
      votes: opt._count.votes,
      percentage:
        totalVotes === 0
          ? 0
          : Math.round((opt._count.votes / totalVotes) * 1000) / 10,
    })),
  }
}

function mapPollWithCounts(
  poll: {
    id: string
    question: string
    description: string | null
    isActive: boolean
    createdById: string
    createdAt: Date
    updatedAt: Date
    options: Array<{ id: string; text: string; pollId: string; _count: { votes: number } }>
    _count: { votes: number }
  },
  hasVoted?: boolean,
) {
  return {
    id: poll.id,
    question: poll.question,
    description: poll.description,
    isActive: poll.isActive,
    createdById: poll.createdById,
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
    totalVotes: poll._count.votes,
    hasVoted: hasVoted ?? false,
    options: poll.options.map((o) => ({
      id: o.id,
      text: o.text,
      pollId: o.pollId,
      voteCount: o._count.votes,
    })),
  }
}

const pollInclude = {
  options: {
    include: { _count: { select: { votes: true } } },
  },
  _count: { select: { votes: true } },
} as const

function assertAdminOwnsPoll(poll: { createdById: string }, adminId: string) {
  if (poll.createdById !== adminId) {
    throw new AppError('No autorizado', 403, 'FORBIDDEN')
  }
}

export const pollService = {
  async listPolls(role: Role, userId: string, activeOnly?: boolean) {
    const where =
      role === 'ADMIN'
        ? {
            createdById: userId,
            ...(activeOnly ? { isActive: true } : {}),
          }
        : {}

    const polls = await prisma.poll.findMany({
      where,
      include: pollInclude,
      orderBy: { createdAt: 'desc' },
    })

    const votedPollIds =
      role === 'USER'
        ? new Set(
            (
              await prisma.vote.findMany({
                where: { userId },
                select: { pollId: true },
              })
            ).map((v) => v.pollId),
          )
        : null

    return polls.map((p) =>
      mapPollWithCounts(p, votedPollIds ? votedPollIds.has(p.id) : undefined),
    )
  },

  async getPollById(id: string, role: Role, userId: string) {
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: pollInclude,
    })

    if (!poll) {
      throw new AppError('Encuesta no encontrada', 404, 'POLL_NOT_FOUND')
    }

    if (role === 'ADMIN') {
      assertAdminOwnsPoll(poll, userId)
    }

    const hasVoted = await prisma.vote.findUnique({
      where: { userId_pollId: { userId, pollId: id } },
    })

    return mapPollWithCounts(poll, !!hasVoted)
  },

  async createPoll(data: CreatePollInput, createdById: string) {
    const poll = await prisma.poll.create({
      data: {
        question: data.question,
        description: data.description ?? null,
        isActive: data.isActive ?? true,
        createdById,
        options: {
          create: data.options.map((o) => ({ text: o.text })),
        },
      },
      include: pollInclude,
    })

    return mapPollWithCounts(poll)
  },

  async updatePoll(id: string, data: UpdatePollInput, userId: string, role: Role) {
    const existing = await prisma.poll.findUnique({
      where: { id },
      include: { options: true },
    })

    if (!existing) {
      throw new AppError('Encuesta no encontrada', 404, 'POLL_NOT_FOUND')
    }

    if (role === 'ADMIN') {
      assertAdminOwnsPoll(existing, userId)
    }

    // Actualiza opciones existentes por id; crea nuevas sin id
    await prisma.$transaction(async (tx) => {
      await tx.poll.update({
        where: { id },
        data: {
          question: data.question,
          description: data.description ?? null,
          isActive: data.isActive ?? true,
        },
      })

      const incomingIds = data.options.filter((o) => o.id).map((o) => o.id!)
      const toDelete = existing.options.filter((o) => !incomingIds.includes(o.id))

      for (const opt of toDelete) {
        await tx.pollOption.delete({ where: { id: opt.id } })
      }

      for (const opt of data.options) {
        if (opt.id) {
          await tx.pollOption.update({
            where: { id: opt.id },
            data: { text: opt.text },
          })
        } else {
          await tx.pollOption.create({
            data: { text: opt.text, pollId: id },
          })
        }
      }
    })

    const updated = await prisma.poll.findUnique({
      where: { id },
      include: pollInclude,
    })

    return mapPollWithCounts(updated!)
  },

  async deletePoll(id: string, userId: string, role: Role) {
    const existing = await prisma.poll.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError('Encuesta no encontrada', 404, 'POLL_NOT_FOUND')
    }
    if (role === 'ADMIN') {
      assertAdminOwnsPoll(existing, userId)
    }
    await prisma.poll.delete({ where: { id } })
  },

  /** Resultados agregados de una encuesta (reutilizable tras votar). */
  async getPollResults(pollId: string) {
    return buildPollResults(pollId)
  },

  async getResultsAdmin(pollId: string) {
    return buildPollResults(pollId)
  },

  async getResults(pollId: string, role: Role, userId: string) {
    const poll = await prisma.poll.findUnique({ where: { id: pollId } })
    if (!poll) {
      throw new AppError('Encuesta no encontrada', 404, 'POLL_NOT_FOUND')
    }

    if (role === 'ADMIN') {
      assertAdminOwnsPoll(poll, userId)
    }

    if (role === 'USER') {
      const voted = await prisma.vote.findUnique({
        where: { userId_pollId: { userId, pollId } },
      })
      if (!voted && !poll.isActive) {
        throw new AppError('No autorizado', 403, 'FORBIDDEN')
      }
    }

    return buildPollResults(pollId)
  },
}
