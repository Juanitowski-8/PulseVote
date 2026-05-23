import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export function WelcomeNavbar() {
  const { isAuthenticated, user } = useAuth()

  const appPath = user?.role === 'ADMIN' ? '/admin/polls' : '/user/polls'

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-[#fafafa]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-neutral-900 transition-opacity hover:opacity-80">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white">
            P
          </span>
          <span className="text-[15px] font-semibold tracking-tight">PulseVote</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <Button
              asChild
              className="h-9 rounded-full bg-neutral-900 px-5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              <Link to={appPath}>Entrar a la app</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="h-9 text-sm text-neutral-600 hover:text-neutral-900">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button
                asChild
                className="h-9 rounded-full bg-neutral-900 px-5 text-sm font-medium text-white hover:bg-neutral-800"
              >
                <Link to="/login">Comenzar</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
