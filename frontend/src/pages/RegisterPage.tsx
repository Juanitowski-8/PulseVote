import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export function RegisterPage() {
  const { register, error, clearError, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'ADMIN' ? '/admin/polls' : '/user/polls', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const handleRegister = async (name: string, email: string, password: string) => {
    clearError()
    const newUser = await register({ name, email, password })
    navigate(newUser.role === 'ADMIN' ? '/admin/polls' : '/user/polls', { replace: true })
  }

  return (
    <Card className="landing-surface-card shadow-sm">
      <CardHeader className="space-y-1 pb-2 text-center sm:text-left">
        <CardTitle className="text-xl font-semibold text-pv-main">Crear cuenta</CardTitle>
        <CardDescription className="text-pv-muted">
          Regístrate para votar en encuestas. Tus votos quedarán asociados a tu usuario.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm onSubmit={handleRegister} error={error} />
        <p className="mt-4 text-center text-xs text-pv-muted">
          Los administradores gestionan encuestas con cuentas autorizadas.{' '}
          <Link to="/login" className="text-primary hover:underline">
            Acceso admin
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
