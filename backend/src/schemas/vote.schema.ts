import { z } from 'zod'

export const voteBodySchema = z.object({
  optionId: z.string().min(1, 'optionId es obligatorio'),
})

export const votePollParamSchema = z.object({
  id: z.string().min(1, 'ID de encuesta inválido'),
})
