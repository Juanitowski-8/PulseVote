import { z } from 'zod'

const pollOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string().trim().min(1, 'La opción no puede estar vacía'),
})

export const createPollSchema = z.object({
  question: z.string().trim().min(1, 'La pregunta es obligatoria'),
  description: z.string().trim().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  options: z.array(pollOptionSchema).min(2, 'Debe haber al menos 2 opciones'),
})

export const updatePollSchema = createPollSchema

export const pollIdParamSchema = z.object({
  id: z.string().min(1, 'ID de encuesta inválido'),
})
