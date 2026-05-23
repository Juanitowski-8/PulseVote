import { INITIAL_POLLS } from '@/mocks/initialPolls'
import type { Poll, PollFormData, PollResults, DashboardSummary } from '@/types/poll'
import type { Vote } from '@/types/poll'

const STORAGE_KEY = 'pulsevote_mock_data'
const LEGACY_STORAGE_KEY = 'verdicta_mock_data'

interface MockData {
  polls: Poll[]
  votes: Vote[]
}

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function loadData(): MockData {
  try {
    let raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
      if (legacy) {
        localStorage.setItem(STORAGE_KEY, legacy)
        localStorage.removeItem(LEGACY_STORAGE_KEY)
        raw = legacy
      }
    }
    if (raw) {
      return JSON.parse(raw) as MockData
    }
  } catch {
    /* use defaults */
  }
  return { polls: structuredClone(INITIAL_POLLS), votes: [] }
}

function saveData(data: MockData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function recalcTotals(poll: Poll): Poll {
  const totalVotes = poll.options.reduce((sum, o) => sum + o.voteCount, 0)
  return { ...poll, totalVotes, updatedAt: new Date().toISOString() }
}

let cache: MockData | null = null

function getData(): MockData {
  if (!cache) {
    cache = loadData()
  }
  return cache
}

function persist() {
  if (cache) saveData(cache)
}

export function resetMockStore() {
  cache = { polls: structuredClone(INITIAL_POLLS), votes: [] }
  persist()
}

export type PollListScope = {
  role?: 'ADMIN' | 'USER'
  userId?: string
}

export function getAllPolls(activeOnly = false, scope?: PollListScope): Poll[] {
  const { polls } = getData()
  let list = [...polls]
  if (scope?.role === 'ADMIN' && scope.userId) {
    list = list.filter((p) => p.createdById === scope.userId)
  }
  if (activeOnly) {
    list = list.filter((p) => p.isActive)
  }
  return list.map(recalcTotals)
}

export function getPollById(id: string): Poll | undefined {
  return getAllPolls().find((p) => p.id === id)
}

export function hasUserVoted(userId: string, pollId: string): boolean {
  return getData().votes.some((v) => v.userId === userId && v.pollId === pollId)
}

export function getUserVote(userId: string, pollId: string): Vote | undefined {
  return getData().votes.find((v) => v.userId === userId && v.pollId === pollId)
}

export function createPoll(data: PollFormData, createdById: string): Poll {
  const dataStore = getData()
  const id = generateId('poll')
  const poll: Poll = recalcTotals({
    id,
    question: data.question.trim(),
    isActive: data.isActive,
    createdById,
    totalVotes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: data.options.map((o) => ({
      id: o.id ?? generateId('opt'),
      text: o.text.trim(),
      pollId: id,
      voteCount: 0,
    })),
  })
  dataStore.polls.unshift(poll)
  persist()
  return poll
}

function assertMockPollOwner(poll: Poll, userId: string) {
  if (poll.createdById !== userId) {
    throw new Error('No autorizado')
  }
}

export function updatePoll(id: string, data: PollFormData, userId?: string, role?: string): Poll {
  const dataStore = getData()
  const index = dataStore.polls.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Encuesta no encontrada')

  const existing = dataStore.polls[index]
  if (role === 'ADMIN' && userId) {
    assertMockPollOwner(existing, userId)
  }
  const updated = recalcTotals({
    ...existing,
    question: data.question.trim(),
    isActive: data.isActive,
    options: data.options.map((o) => {
      const prev = existing.options.find((x) => x.id === o.id)
      return {
        id: o.id ?? generateId('opt'),
        text: o.text.trim(),
        pollId: id,
        voteCount: prev?.voteCount ?? 0,
      }
    }),
  })
  dataStore.polls[index] = updated
  persist()
  return updated
}

export function deletePoll(id: string, userId?: string, role?: string): void {
  const dataStore = getData()
  const poll = dataStore.polls.find((p) => p.id === id)
  if (!poll) throw new Error('Encuesta no encontrada')
  if (role === 'ADMIN' && userId) {
    assertMockPollOwner(poll, userId)
  }
  dataStore.polls = dataStore.polls.filter((p) => p.id !== id)
  dataStore.votes = dataStore.votes.filter((v) => v.pollId !== id)
  persist()
}

export function togglePollActive(id: string): Poll {
  const dataStore = getData()
  const poll = dataStore.polls.find((p) => p.id === id)
  if (!poll) throw new Error('Encuesta no encontrada')
  poll.isActive = !poll.isActive
  poll.updatedAt = new Date().toISOString()
  persist()
  return recalcTotals(poll)
}

export function castVote(userId: string, pollId: string, optionId: string): void {
  const dataStore = getData()
  const poll = dataStore.polls.find((p) => p.id === pollId)
  if (!poll) throw new Error('Encuesta no encontrada')
  if (!poll.isActive) throw new Error('La encuesta no está activa')
  if (hasUserVoted(userId, pollId)) throw new Error('Ya has votado en esta encuesta')

  const option = poll.options.find((o) => o.id === optionId)
  if (!option || option.pollId !== pollId) throw new Error('Opción inválida')

  option.voteCount += 1
  poll.updatedAt = new Date().toISOString()
  dataStore.votes.push({
    id: generateId('vote'),
    userId,
    pollId,
    optionId,
    createdAt: new Date().toISOString(),
  })
  recalcTotals(poll)
  persist()
}

export function getPollResults(pollId: string): PollResults {
  const poll = getPollById(pollId)
  if (!poll) throw new Error('Encuesta no encontrada')

  const total = poll.totalVotes || 1
  return {
    pollId: poll.id,
    question: poll.question,
    totalVotes: poll.totalVotes,
    updatedAt: poll.updatedAt,
    options: poll.options.map((o) => ({
      optionId: o.id,
      text: o.text,
      votes: o.voteCount,
      percentage: poll.totalVotes === 0 ? 0 : (o.voteCount / total) * 100,
    })),
  }
}

export function getDashboardSummary(adminUserId?: string): DashboardSummary {
  const polls = adminUserId
    ? getAllPolls(false, { role: 'ADMIN', userId: adminUserId })
    : getAllPolls()
  const totalVotes = polls.reduce((s, p) => s + p.totalVotes, 0)
  const activePolls = polls.filter((p) => p.isActive).length
  const averageParticipation =
    polls.length === 0 ? 0 : Math.round(totalVotes / polls.length)

  return {
    totalPolls: polls.length,
    totalVotes,
    activePolls,
    averageParticipation,
    polls,
    updatedAt: new Date().toISOString(),
  }
}

/** Simula actividad en vivo para el dashboard (solo mocks). */
export function simulateLiveActivity(): void {
  const dataStore = getData()
  const active = dataStore.polls.filter((p) => p.isActive)
  if (active.length === 0) return

  const poll = active[Math.floor(Math.random() * active.length)]
  const option = poll.options[Math.floor(Math.random() * poll.options.length)]
  if (!option) return

  option.voteCount += 1
  poll.updatedAt = new Date().toISOString()
  recalcTotals(poll)
  persist()
}
