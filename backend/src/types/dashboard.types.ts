/** Resumen del dashboard para administradores */
export interface AdminDashboardSummary {
  totalPolls: number
  activePolls: number
  inactivePolls: number
  totalVotes: number
  totalUsers: number
  /** Promedio de votos por encuesta (1 decimal) */
  averageParticipation: number
  latestPolls: DashboardPollListItem[]
  mostVotedPolls: DashboardMostVotedItem[]
  /** Listado ligero para selector de encuesta en el frontend */
  polls: DashboardPollListItem[]
}

/** Resumen del dashboard para usuarios */
export interface UserDashboardSummary {
  activePolls: number
  pollsVotedByUser: number
  pendingPolls: number
  totalVotes: number
  latestActivePolls: DashboardUserPollItem[]
}

export interface DashboardPollListItem {
  id: string
  question: string
  isActive: boolean
  createdAt: Date
  totalVotes: number
}

export interface DashboardMostVotedItem {
  id: string
  question: string
  totalVotes: number
}

export interface DashboardUserPollItem {
  id: string
  question: string
  hasVoted: boolean
  createdAt: Date
}

/** Resultados agregados para el dashboard (polling) */
export interface DashboardPollResults {
  pollId: string
  question: string
  description: string | null
  isActive: boolean
  totalVotes: number
  options: Array<{
    optionId: string
    text: string
    votes: number
    percentage: number
  }>
  updatedAt: Date
  generatedAt: Date
}

export type DashboardSummary = AdminDashboardSummary | UserDashboardSummary
