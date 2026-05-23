import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { WelcomeNavbar } from '@/components/layout/WelcomeNavbar'
import { HeroDashboardPreview } from '@/components/welcome/HeroDashboardPreview'
import { HowItWorks } from '@/components/welcome/HowItWorks'
import { AnimatedPremiumBackground } from '@/components/layout/AnimatedPremiumBackground'
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
      <div className="landing-page relative flex min-h-screen items-center justify-center overflow-hidden">
        <AnimatedPremiumBackground />
        <div className="relative z-10">
          <LoadingState message="Cargando..." />
        </div>
      </div>
    )
  }

  return (
    <div className="landing-page relative flex min-h-screen flex-col overflow-hidden">
      <AnimatedPremiumBackground />
      <WelcomeNavbar />

      <main className="relative z-10 flex-1">
        <section
          id="producto"
          className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-16 lg:pt-20"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14 xl:gap-16">
            <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
              <span className="landing-badge">Real-time polling platform</span>

              <h1 className="landing-title mt-6">PulseVote</h1>

              <p className="landing-subtitle mt-5">
                Encuestas en tiempo real para equipos que deciden con datos.
              </p>

              <p className="landing-lead mt-4 max-w-lg lg:max-w-md">
                Crea encuestas, recibe votos y analiza resultados en vivo desde un dashboard claro
                y profesional.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link to="/login" className="landing-btn-primary h-11 px-7 text-[15px]">
                  Comenzar ahora
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link to="/login" className="landing-btn-secondary h-11 px-7 text-[15px]">
                  Iniciar sesión
                </Link>
              </div>
            </div>

            <div className="w-full lg:pt-2">
              <HeroDashboardPreview />
            </div>
          </div>
        </section>

        <div id="como-funciona">
          <HowItWorks />
        </div>
        <div id="roles">
          <RoleEntryCards />
        </div>

        <section className="border-t border-[#12382B] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-[#F3FFF8] sm:text-3xl">
              Listo para entrar
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#8FA99B] sm:text-base">
              Inicia sesión con las cuentas de demo o las credenciales de tu organización.
            </p>
            <Link to="/login" className="landing-btn-primary mt-8 inline-flex h-11 px-8 text-[15px]">
              Iniciar sesión
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#12382B] py-8 text-center text-xs text-[#8FA99B]">
        PulseVote · Encuestas en tiempo real
      </footer>
    </div>
  )
}
