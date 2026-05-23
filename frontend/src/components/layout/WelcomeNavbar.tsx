import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const navLinks = [
  { href: '#producto', label: 'Producto' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#roles', label: 'Roles' },
]

export function WelcomeNavbar() {
  const { isAuthenticated, user } = useAuth()
  const appPath = user?.role === 'ADMIN' ? '/admin/polls' : '/user/polls'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-md',
        'border-neutral-200/80 bg-[#fafafa]/80',
        'dark:border-white/10 dark:bg-black/80',
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="shrink-0 text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-white"
        >
          PulseVote
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <Button
              asChild
              className="h-9 rounded-full bg-neutral-900 px-5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              <Link to={appPath}>Entrar a la app</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="h-9 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button
                asChild
                className={cn(
                  'h-9 gap-1 rounded-full px-4 text-sm font-medium',
                  'bg-neutral-900 text-white hover:bg-neutral-800',
                  'dark:border dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10',
                )}
              >
                <Link to="/login">
                  Comenzar
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
