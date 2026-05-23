export interface PollResultOption {
  optionId: string
  text: string
  votes: number
  percentage: number
}

export interface PollResults {
  pollId: string
  question: string
  totalVotes: number
  options: PollResultOption[]
  updatedAt: Date
}

export interface DashboardSummary {
  totalPolls: number
  totalVotes: number
  activePolls: number
  averageParticipation: number
  polls: Array<{
    id: string
    question: string
    isActive: boolean
    totalVotes: number
    updatedAt: Date
  }>
  updatedAt: Date
}
