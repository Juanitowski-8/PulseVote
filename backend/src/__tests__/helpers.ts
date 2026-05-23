import request from 'supertest'
import type { Express } from 'express'

export const ADMIN_CREDENTIALS = {
  email: 'admin@pulsevote.app',
  password: 'Admin123!',
} as const

export const USER_CREDENTIALS = {
  email: 'user@pulsevote.app',
  password: 'User123!',
} as const

export async function loginAndGetToken(
  app: Express,
  credentials: { email: string; password: string },
): Promise<string> {
  const res = await request(app)
    .post('/api/auth/login')
    .send(credentials)
    .expect(200)

  expect(res.body.success).toBe(true)
  expect(res.body.data?.token).toBeTruthy()

  return res.body.data.token as string
}

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}
