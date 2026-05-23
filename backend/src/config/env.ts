import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

function parseCorsOrigins(frontendUrl: string, frontendUrls?: string): string[] {
  if (frontendUrls?.trim()) {
    const origins = frontendUrls
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    for (const origin of origins) {
      try {
        new URL(origin)
      } catch {
        throw new Error(`FRONTEND_URLS contiene una URL inválida: ${origin}`)
      }
    }

    return origins
  }

  return [frontendUrl]
}

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es obligatoria'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET debe tener al menos 16 caracteres'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  FRONTEND_URLS: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

let corsOrigins: string[]
try {
  corsOrigins = parseCorsOrigins(parsed.data.FRONTEND_URL, parsed.data.FRONTEND_URLS)
} catch (error) {
  console.error('❌', error instanceof Error ? error.message : error)
  process.exit(1)
}

export const env = {
  ...parsed.data,
  corsOrigins,
}
