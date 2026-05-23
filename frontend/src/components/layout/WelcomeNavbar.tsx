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
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-8 px-5 sm:h-[84px] sm:px-8">
        <Link to="/" className="shrink-0 transition-opacity hover:opacity-85">
          <PulseVoteBrand
            logoSize={36}
            className="gap-3"
            nameClassName="text-lg font-semibold text-[#F3FFF8] sm:text-xl"
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Principal">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-base font-medium text-[#8FA99B] transition-colors hover:text-[#F3FFF8]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <Link to={appPath} className="landing-btn-primary h-11 px-6 text-[15px]">
              Entrar a la app
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden h-11 items-center px-4 text-base font-medium text-[#8FA99B] transition-colors hover:text-[#F3FFF8] sm:inline-flex"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/login"
                className={cn('landing-btn-primary h-11 gap-1.5 px-6 text-[15px]')}
              >
                Comenzar
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
