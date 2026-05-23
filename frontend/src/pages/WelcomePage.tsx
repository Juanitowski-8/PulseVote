import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { WelcomeNavbar } from '@/components/layout/WelcomeNavbar'
import { HeroDashboardPreview } from '@/components/welcome/HeroDashboardPreview'
import { HowItWorks } from '@/components/welcome/HowItWorks'
import { LandingAmbient } from '@/components/welcome/LandingAmbient'
import { RoleEntryCards } from '@/components/welcome/RoleEntryCards'
import { LoadingState } from '@/components/states/LoadingState'
import { useAuth } from '@/hooks/useAuth'

export function WelcomePage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      navigate(user.role === 'ADMIN' ? '/admin/polls' : '/user/polls', { replace: true })
    }
  }, [isLoading, isAuthenticated, user, navigate])

  if (isLoading) {
    return (
      <div className="landing-page flex min-h-screen items-center justify-center">
        <LoadingState message="Cargando..." />
      </div>
    )
  }

  return (
    <div className="landing-page relative flex min-h-screen flex-col text-[#F3FFF8]">
      <LandingAmbient />
      <WelcomeNavbar />

      <main className="flex-1">
        <section
          id="producto"
          className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20"
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="landing-badge">Real-time polling platform</span>

            <h1 className="mt-8 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              <span className="landing-brand-text">PulseVote</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg font-medium leading-snug text-[#F3FFF8] sm:text-xl">
              Encuestas en tiempo real para equipos que deciden con datos.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#8FA99B]">
              Crea encuestas, recibe votos y analiza resultados en vivo desde un dashboard claro y
              profesional.
            </p>

            <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <Link to="/login" className="landing-btn-primary h-11 px-8 text-[15px]">
                Comenzar ahora
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link to="/login" className="landing-btn-secondary h-11 px-8 text-[15px]">
                Iniciar sesión
              </Link>
            </div>
          </div>

          <div className="relative mt-16 sm:mt-20">
            <div
              className="pointer-events-none absolute -inset-x-8 top-1/2 h-1/2 -translate-y-1/4 bg-[radial-gradient(ellipse_at_center,rgba(0,245,138,0.06),transparent_70%)]"
              aria-hidden
            />
            <HeroDashboardPreview />
          </div>
        </section>

        <div id="como-funciona">
          <HowItWorks />
        </div>
        <div id="roles">
          <RoleEntryCards />
        </div>

        <section className="border-t border-[#12382B] px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-[#F3FFF8]">Listo para entrar</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#8FA99B] sm:text-base">
            Inicia sesión con las cuentas de demo o las credenciales de tu organización.
          </p>
          <Link to="/login" className="landing-btn-primary mt-8 inline-flex h-11 px-8 text-[15px]">
            Iniciar sesión
          </Link>
        </section>
      </main>

      <footer className="border-t border-[#12382B] py-8 text-center text-xs text-[#8FA99B]">
        PulseVote · Encuestas en tiempo real
      </footer>
    </div>
  )
}
