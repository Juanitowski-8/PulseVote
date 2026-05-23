import { prisma } from '../config/prisma'
import { AppError } from '../utils/AppError'
import { comparePassword, hashPassword } from '../utils/password'
import { Role } from '@prisma/client'
import { signToken } from '../utils/jwt'
import { toAuthUser, type AuthResponse, type AuthUser } from '../types/auth.types'

export const authService = {
  /**
   * Valida credenciales, compara hash y devuelve JWT + usuario público.
   * Mismo mensaje si el email no existe o la contraseña falla (no filtra información).
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      throw new AppError('Credenciales incorrectas', 401, 'INVALID_CREDENTIALS')
    }

    const valid = await comparePassword(password, user.passwordHash)
    if (!valid) {
      throw new AppError('Credenciales incorrectas', 401, 'INVALID_CREDENTIALS')
    }

    const token = signToken({ userId: user.id, role: user.role })

    return {
      token,
      user: toAuthUser(user),
    }
  },

  /** Carga usuario por id; usado por authenticate y /me. */
  /** Registro público: rol USER por defecto; email único en BD. */
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const normalizedEmail = email.toLowerCase()

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      throw new AppError('Ya existe una cuenta con este email', 409, 'EMAIL_ALREADY_EXISTS')
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: Role.USER,
      },
    })

    const token = signToken({ userId: user.id, role: user.role })

    return {
      token,
      user: toAuthUser(user),
    }
  },

  async findUserById(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new AppError('Usuario no encontrado', 401, 'UNAUTHORIZED')
    }

    return toAuthUser(user)
  },
}
