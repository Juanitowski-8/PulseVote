import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

interface LoginLocationState {
  preset?: 'admin' | 'user'
}

export function LoginPage() {
  const { login, error, clearError, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const preset = (location.state as LoginLocationState | null)?.preset

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'ADMIN' ? '/admin/polls' : '/user/polls', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const handleLogin = async (email: string, password: string) => {
    clearError()
    const loggedUser = await login({ email, password })
    navigate(loggedUser.role === 'ADMIN' ? '/admin/polls' : '/user/polls', { replace: true })
  }

  return (
    <Card className="border-neutral-200/80 bg-white shadow-lg shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
      <CardHeader className="text-center sm:text-left">
        <CardTitle className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Iniciar sesión</CardTitle>
        <CardDescription className="text-neutral-600 dark:text-neutral-400">
          {preset === 'admin'
            ? 'Accede al panel de administración para crear encuestas y ver el dashboard.'
            : preset === 'user'
              ? 'Accede para votar en las encuestas activas.'
              : 'Accede para gestionar encuestas o participar en las activas.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm onSubmit={handleLogin} error={error} preset={preset} />
      </CardContent>
    </Card>
  )
}
