import type { Role } from '@prisma/client'
import type { User } from '@prisma/client'

/** Usuario expuesto en API — nunca incluye passwordHash. */
export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}
