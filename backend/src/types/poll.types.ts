export interface PollResultOption {
  optionId: string
  text: string
  votes: number
  percentage: number
}

export interface PollResults {
  pollId: string
  question: string
  description: string | null
  isActive: boolean
  totalVotes: number
  options: PollResultOption[]
  updatedAt: Date
}
