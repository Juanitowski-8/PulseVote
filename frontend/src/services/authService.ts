import { addMockUser, findMockUser, findMockUserByEmail } from '@/mocks/users'
import {
  api,
  TOKEN_KEY,
  USER_KEY,
  USE_MOCKS,
  unwrapData,
} from '@/services/api'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  AuthResponse,
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '@/types/auth'

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function saveSession(session: AuthSession) {
  localStorage.setItem(TOKEN_KEY, session.token)
  localStorage.setItem(USER_KEY, JSON.stringify(session.user))
}

export function getStoredSession(): AuthSession | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const userRaw = localStorage.getItem(USER_KEY)
  if (!token || !userRaw) return null
  try {
    const user = JSON.parse(userRaw) as User
    return { token, user }
  } catch {
    return null
  }
}

function generateMockUserId() {
  return `usr_${Math.random().toString(36).slice(2, 10)}`
}

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    if (USE_MOCKS) {
      await delay(600)
      const normalizedEmail = credentials.email.trim().toLowerCase()
      if (findMockUserByEmail(normalizedEmail)) {
        throw new Error('Ya existe una cuenta con este email')
      }
      const user: User = {
        id: generateMockUserId(),
        name: credentials.name.trim(),
        email: normalizedEmail,
        role: 'USER',
      }
      addMockUser({ ...user, password: credentials.password })
      const response: AuthResponse = {
        token: `mock_jwt_${user.id}`,
        user,
      }
      saveSession(response)
      return response
    }

    const res = await api.post<ApiSuccessResponse<AuthResponse>>('/auth/register', {
      name: credentials.name.trim(),
      email: credentials.email.trim(),
      password: credentials.password,
    })
    const data = unwrapData<AuthResponse>(res)
    saveSession(data)
    return data
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCKS) {
      await delay(600)
      const match = findMockUser(credentials.email, credentials.password)
      if (!match) {
        throw new Error('Credenciales incorrectas. Revisa el email y la contraseña.')
      }
      const { password: _, ...user } = match
      const response: AuthResponse = {
        token: `mock_jwt_${user.id}`,
        user,
      }
      saveSession(response)
      return response
    }

    const res = await api.post<ApiSuccessResponse<AuthResponse>>('/auth/login', credentials)
    const data = unwrapData<AuthResponse>(res)
    saveSession(data)
    return data
  },

  async me(): Promise<User> {
    if (USE_MOCKS) {
      await delay(200)
      const session = getStoredSession()
      if (!session) throw new Error('No autenticado')
      return session.user
    }

    const res = await api.get<ApiSuccessResponse<User>>('/auth/me')
    const user = unwrapData<User>(res)
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
    return user
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
