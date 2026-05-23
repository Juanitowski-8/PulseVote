import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LoadingState } from '@/components/states/LoadingState'
import { useAuth } from '@/hooks/useAuth'
import type { Role } from '@/types/auth'

interface ProtectedRouteProps {
  allowedRoles?: Role[]
}

function getDefaultPath(role: Role) {
  return role === 'ADMIN' ? '/admin/polls' : '/user/polls'
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingState message="Verificando sesión..." />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultPath(user.role)} replace />
  }

  return <Outlet />
}
