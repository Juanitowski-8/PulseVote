import { z } from 'zod'

export const voteBodySchema = z.object({
  optionId: z.string().trim().min(1, 'optionId is required'),
})

export const votePollParamSchema = z.object({
  id: z.string().trim().min(1, 'Poll id is required'),
})
