import type { PollResults } from './poll.types'

export interface VoteRecord {
  id: string
  userId: string
  pollId: string
  optionId: string
  createdAt: Date
}

export interface CastVoteResult {
  vote: VoteRecord
  results: PollResults
}
