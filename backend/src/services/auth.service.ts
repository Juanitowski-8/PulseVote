import { prisma } from '../config/prisma'
import { AppError } from '../utils/AppError'
import { comparePassword } from '../utils/password'
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
  async findUserById(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new AppError('Usuario no encontrado', 401, 'UNAUTHORIZED')
    }

    return toAuthUser(user)
  },
}
