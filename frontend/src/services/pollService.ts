import * as mockStore from '@/mocks/mockStore'
import { api, USE_MOCKS } from '@/services/api'
import type {
  DashboardSummary,
  Poll,
  PollFormData,
  PollResults,
  VotePayload,
} from '@/types/poll'

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const pollService = {
  async getPolls(activeOnly = false): Promise<Poll[]> {
    if (USE_MOCKS) {
      await delay()
      return mockStore.getAllPolls(activeOnly)
    }
    const { data } = await api.get<Poll[]>('/polls', {
      params: activeOnly ? { active: true } : undefined,
    })
    return data
  },

  async getPollById(id: string): Promise<Poll> {
    if (USE_MOCKS) {
      await delay()
      const poll = mockStore.getPollById(id)
      if (!poll) throw new Error('Encuesta no encontrada')
      return poll
    }
    const { data } = await api.get<Poll>(`/polls/${id}`)
    return data
  },

  async createPoll(payload: PollFormData): Promise<Poll> {
    if (USE_MOCKS) {
      await delay(500)
      return mockStore.createPoll(payload, 'usr_admin')
    }
    const { data } = await api.post<Poll>('/polls', payload)
    return data
  },

  async updatePoll(id: string, payload: PollFormData): Promise<Poll> {
    if (USE_MOCKS) {
      await delay(500)
      return mockStore.updatePoll(id, payload)
    }
    const { data } = await api.put<Poll>(`/polls/${id}`, payload)
    return data
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
    await api.post(`/polls/${pollId}/vote`, payload)
  },

  hasVoted(userId: string, pollId: string): boolean {
    if (USE_MOCKS) return mockStore.hasUserVoted(userId, pollId)
    return false
  },

  async getPollResults(pollId: string): Promise<PollResults> {
    if (USE_MOCKS) {
      await delay(200)
      return mockStore.getPollResults(pollId)
    }
    const { data } = await api.get<PollResults>(`/polls/${pollId}/results`)
    return data
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    if (USE_MOCKS) {
      await delay(200)
      return mockStore.getDashboardSummary()
    }
    const { data } = await api.get<DashboardSummary>('/dashboard/summary')
    return data
  },

  async getDashboardPollResults(pollId: string): Promise<PollResults> {
    if (USE_MOCKS) {
      await delay(200)
      return mockStore.getPollResults(pollId)
    }
    const { data } = await api.get<PollResults>(`/dashboard/polls/${pollId}/results`)
    return data
  },

  simulateLiveTick() {
    if (USE_MOCKS) mockStore.simulateLiveActivity()
  },
}
