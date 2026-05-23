import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authService, getStoredSession } from '@/services/authService'
import { getErrorMessage } from '@/services/api'
import type { LoginCredentials, User } from '@/types/auth'

interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<User>
  logout: () => void
  error: string | null
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const session = getStoredSession()
      if (!session) {
        setIsLoading(false)
        return
      }
      setUser(session.user)
      setToken(session.token)
      try {
        const freshUser = await authService.me()
        setUser(freshUser)
      } catch {
        authService.logout()
        setUser(null)
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }
    void init()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null)
    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      setToken(response.token)
      return response.user
    } catch (err) {
      const message = getErrorMessage(err, 'Error al iniciar sesión')
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setToken(null)
    setError(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!user && !!token,
      login,
      logout,
      error,
      clearError: () => setError(null),
    }),
    [user, token, isLoading, login, logout, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
