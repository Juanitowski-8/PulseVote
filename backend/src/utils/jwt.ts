import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import type { Role } from '@prisma/client'

/** Payload mínimo del JWT — solo identidad y rol para autorización. */
export interface JwtPayload {
  userId: string
  role: Role
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET)

  if (typeof decoded !== 'object' || decoded === null) {
    throw new jwt.JsonWebTokenError('Payload inválido')
  }

  const { userId, role } = decoded as JwtPayload

  if (!userId || !role) {
    throw new jwt.JsonWebTokenError('Payload incompleto')
  }

  return { userId, role }
}
