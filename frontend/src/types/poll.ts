export interface PollOption {
  id: string
  text: string
  pollId: string
  voteCount: number
}

export interface Poll {
  id: string
  question: string
  description?: string | null
  isActive: boolean
  createdById: string
  options: PollOption[]
  totalVotes: number
  hasVoted?: boolean
  createdAt: string
  updatedAt: string
}

export interface PollFormData {
  question: string
  description?: string | null
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
  description?: string | null
  isActive?: boolean
  totalVotes: number
  options: PollResultOption[]
  updatedAt: string
  generatedAt?: string
}

/** Resumen dashboard ADMIN (backend). */
export interface AdminDashboardSummary {
  totalPolls: number
  activePolls: number
  inactivePolls: number
  totalVotes: number
  totalUsers: number
  averageParticipation: number
  latestPolls: DashboardPollListItem[]
  mostVotedPolls: DashboardMostVotedItem[]
  polls: DashboardPollListItem[]
}

export interface DashboardPollListItem {
  id: string
  question: string
  isActive: boolean
  createdAt: string
  totalVotes: number
}

export interface DashboardMostVotedItem {
  id: string
  question: string
  totalVotes: number
}

/** Vista unificada para la página dashboard (ADMIN). */
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
