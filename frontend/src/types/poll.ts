export interface PollOption {
  id: string
  text: string
  pollId: string
  voteCount: number
}

export interface Poll {
  id: string
  question: string
  isActive: boolean
  createdById: string
  options: PollOption[]
  totalVotes: number
  createdAt: string
  updatedAt: string
}

export interface PollFormData {
  question: string
  isActive: boolean
  options: { id?: string; text: string }[]
}

export interface Vote {
  id: string
  userId: string
  pollId: string
  optionId: string
  createdAt: string
}

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
  updatedAt: string
}

export interface DashboardSummary {
  totalPolls: number
  totalVotes: number
  activePolls: number
  averageParticipation: number
  polls: Poll[]
  updatedAt: string
}

export interface VotePayload {
  optionId: string
}
