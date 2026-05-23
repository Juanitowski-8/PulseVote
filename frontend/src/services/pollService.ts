import * as mockStore from '@/mocks/mockStore'
import { api, USE_MOCKS, unwrapData } from '@/services/api'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  AdminDashboardSummary,
  DashboardPollListItem,
  DashboardSummary,
  Poll,
  PollFormData,
  PollResults,
  VotePayload,
} from '@/types/poll'

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type ApiPoll = Omit<Poll, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date
  updatedAt: string | Date
}

type ApiPollResults = Omit<PollResults, 'updatedAt' | 'generatedAt'> & {
  updatedAt: string | Date
  generatedAt?: string | Date
}

function toIso(value: string | Date): string {
  return typeof value === 'string' ? value : value.toISOString()
}

function mapPollFromApi(poll: ApiPoll): Poll {
  return {
    ...poll,
    description: poll.description ?? null,
    hasVoted: poll.hasVoted ?? false,
    createdAt: toIso(poll.createdAt),
    updatedAt: toIso(poll.updatedAt),
    options: poll.options.map((o) => ({
      ...o,
      voteCount: o.voteCount ?? 0,
    })),
  }
}

function mapResultsFromApi(results: ApiPollResults): PollResults {
  return {
    ...results,
    updatedAt: toIso(results.updatedAt),
    generatedAt: results.generatedAt ? toIso(results.generatedAt) : undefined,
  }
}

function mapListItemToPoll(item: DashboardPollListItem): Poll {
  const createdAt = toIso(item.createdAt)
  return {
    id: item.id,
    question: item.question,
    isActive: item.isActive,
    createdById: '',
    options: [],
    totalVotes: item.totalVotes,
    hasVoted: false,
    createdAt,
    updatedAt: createdAt,
  }
}

function mapAdminDashboard(data: AdminDashboardSummary): DashboardSummary {
  return {
    totalPolls: data.totalPolls,
    totalVotes: data.totalVotes,
    activePolls: data.activePolls,
    averageParticipation: data.averageParticipation,
    polls: data.polls.map(mapListItemToPoll),
    updatedAt: new Date().toISOString(),
  }
}

function buildPollPayload(payload: PollFormData) {
  return {
    question: payload.question,
    description: payload.description ?? null,
    isActive: payload.isActive,
    options: payload.options.map((o) => ({
      ...(o.id ? { id: o.id } : {}),
      text: o.text.trim(),
    })),
  }
}

export const pollService = {
  async getPolls(activeOnly = false): Promise<Poll[]> {
    if (USE_MOCKS) {
      await delay()
      return mockStore.getAllPolls(activeOnly)
    }
    const res = await api.get<ApiPoll[]>('/polls', {
      params: activeOnly ? { active: true } : undefined,
    })
    const data = unwrapData<ApiPoll[]>(res)
    return data.map(mapPollFromApi)
  },

  async getPollById(id: string): Promise<Poll> {
    if (USE_MOCKS) {
      await delay()
      const poll = mockStore.getPollById(id)
      if (!poll) throw new Error('Encuesta no encontrada')
      return poll
    }
    const res = await api.get<ApiPoll>(`/polls/${id}`)
    return mapPollFromApi(unwrapData<ApiPoll>(res))
  },

  async createPoll(payload: PollFormData): Promise<Poll> {
    if (USE_MOCKS) {
      await delay(500)
      return mockStore.createPoll(payload, 'usr_admin')
    }
    const res = await api.post<ApiPoll>('/polls', buildPollPayload(payload))
    return mapPollFromApi(unwrapData<ApiPoll>(res))
  },

  async updatePoll(id: string, payload: PollFormData): Promise<Poll> {
    if (USE_MOCKS) {
      await delay(500)
      return mockStore.updatePoll(id, payload)
    }
    const res = await api.put<ApiPoll>(`/polls/${id}`, buildPollPayload(payload))
    return mapPollFromApi(unwrapData<ApiPoll>(res))
  },

  async deletePoll(id: string): Promise<void> {
    if (USE_MOCKS) {
      await delay(400)
      mockStore.deletePoll(id)
      return
    }
    await api.delete(`/polls/${id}`)
  },

  async togglePollActive(id: string): Promise<Poll> {
    if (USE_MOCKS) {
      await delay(300)
      return mockStore.togglePollActive(id)
    }
    const poll = await this.getPollById(id)
    return this.updatePoll(id, {
      question: poll.question,
      description: poll.description,
      isActive: !poll.isActive,
      options: poll.options.map((o) => ({ id: o.id, text: o.text })),
    })
  },

  async vote(pollId: string, payload: VotePayload, userId: string): Promise<void> {
    if (USE_MOCKS) {
      await delay(500)
      mockStore.castVote(userId, pollId, payload.optionId)
      return
    }
    await api.post<ApiSuccessResponse<unknown>>(`/polls/${pollId}/vote`, payload)
  },

  hasVoted(userId: string, pollId: string, poll?: Poll): boolean {
    if (USE_MOCKS) return mockStore.hasUserVoted(userId, pollId)
    return poll?.hasVoted ?? false
  },

  async getPollResults(pollId: string): Promise<PollResults> {
    if (USE_MOCKS) {
      await delay(200)
      return mockStore.getPollResults(pollId)
    }
    const res = await api.get<ApiPollResults>(`/polls/${pollId}/results`)
    return mapResultsFromApi(unwrapData<ApiPollResults>(res))
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    if (USE_MOCKS) {
      await delay(200)
      return mockStore.getDashboardSummary()
    }
    const res = await api.get<ApiSuccessResponse<AdminDashboardSummary>>('/dashboard/summary')
    const data = unwrapData<AdminDashboardSummary>(res)
    return mapAdminDashboard(data)
  },

  async getDashboardPollResults(pollId: string): Promise<PollResults> {
    if (USE_MOCKS) {
      await delay(200)
      return mockStore.getPollResults(pollId)
    }
    const res = await api.get<ApiSuccessResponse<ApiPollResults>>(
      `/dashboard/polls/${pollId}/results`,
    )
    return mapResultsFromApi(unwrapData<ApiPollResults>(res))
  },

  simulateLiveTick() {
    if (USE_MOCKS) mockStore.simulateLiveActivity()
  },
}
