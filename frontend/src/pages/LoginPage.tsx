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
    <Card className="landing-surface-card shadow-sm">
      <CardHeader className="space-y-1 pb-2 text-center sm:text-left">
        <CardTitle className="text-xl font-semibold text-pv-main">Iniciar sesión</CardTitle>
        <CardDescription className="text-pv-muted">
          {preset === 'admin'
            ? 'Panel de administración: encuestas y dashboard en vivo.'
            : preset === 'user'
              ? 'Accede para votar en las encuestas activas.'
              : 'Gestiona encuestas o participa en las activas.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm onSubmit={handleLogin} error={error} preset={preset} />
      </CardContent>
    </Card>
  )
}
