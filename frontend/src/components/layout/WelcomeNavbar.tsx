import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { PulseVoteBrand } from '@/components/brand/PulseVoteLogo'
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
    <header className="sticky top-0 z-50 border-b border-[#12382B]/80 bg-[#020D0A]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link to="/" className="shrink-0 transition-opacity hover:opacity-85">
          <PulseVoteBrand logoSize={26} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-[#8FA99B] transition-colors hover:text-[#F3FFF8]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <Link to={appPath} className="landing-btn-primary h-9 px-4 text-sm">
              Entrar a la app
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden h-9 items-center px-3 text-sm text-[#8FA99B] transition-colors hover:text-[#F3FFF8] sm:inline-flex"
              >
                Iniciar sesión
              </Link>
              <Link to="/login" className={cn('landing-btn-primary h-9 gap-1 px-4 text-sm')}>
                Comenzar
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
