import { lazy, Suspense, type ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RoutePageFallback } from '@/components/layout/RoutePageFallback'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

const WelcomePage = lazy(() =>
  import('@/pages/WelcomePage').then((m) => ({ default: m.WelcomePage })),
)
const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const AdminPollsPage = lazy(() =>
  import('@/pages/AdminPollsPage').then((m) => ({ default: m.AdminPollsPage })),
)
const UserPollsPage = lazy(() =>
  import('@/pages/UserPollsPage').then((m) => ({ default: m.UserPollsPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function LazyPage({
  children,
  fullScreen = false,
  message,
}: {
  children: ReactNode
  fullScreen?: boolean
  message?: string
}) {
  return (
    <Suspense fallback={<RoutePageFallback fullScreen={fullScreen} message={message} />}>
      {children}
    </Suspense>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LazyPage fullScreen>
            <WelcomePage />
          </LazyPage>
        }
      />

      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <LazyPage message="Preparando acceso...">
              <LoginPage />
            </LazyPage>
          }
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route
              path="/admin/polls"
              element={
                <LazyPage>
                  <AdminPollsPage />
                </LazyPage>
              }
            />
            <Route
              path="/dashboard"
              element={
                <LazyPage>
                  <DashboardPage />
                </LazyPage>
              }
            />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route
              path="/user/polls"
              element={
                <LazyPage>
                  <UserPollsPage />
                </LazyPage>
              }
            />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <LazyPage fullScreen>
            <NotFoundPage />
          </LazyPage>
        }
      />
    </Routes>
  )
}
