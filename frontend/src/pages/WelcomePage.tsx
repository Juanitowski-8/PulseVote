import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { WelcomeNavbar } from '@/components/layout/WelcomeNavbar'
import { HowItWorks } from '@/components/welcome/HowItWorks'
import { LivePreviewMock } from '@/components/welcome/LivePreviewMock'
import { RoleEntryCards } from '@/components/welcome/RoleEntryCards'
import { Button } from '@/components/ui/button'
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
    <div className="landing-page flex min-h-screen flex-col">
      <WelcomeNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-20 sm:pb-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <p className="mb-4 inline-flex items-center rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                Sistema web full-stack · Tiempo real
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-[2.75rem] sm:leading-[1.12]">
                Encuestas en vivo para equipos que deciden con datos
              </h1>
              <p className="mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg">
                <strong className="font-medium text-neutral-900">PulseVote</strong> es un sistema
                web de encuestas en tiempo real: los administradores crean encuestas, los usuarios
                votan, y un dashboard muestra los resultados actualizándose en vivo a medida que
                llegan votos.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  asChild
                  className="h-11 rounded-full bg-neutral-900 px-8 text-base font-medium text-white hover:bg-neutral-800"
                >
                  <Link to="/login">
                    Empezar
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-neutral-300 bg-white px-8 text-base text-neutral-800 hover:bg-neutral-50"
                >
                  <Link to="/login">Ya tengo cuenta</Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <LivePreviewMock />
            </div>
          </div>
        </section>

        <HowItWorks />
        <RoleEntryCards />

        <section className="border-t border-neutral-200/80 bg-neutral-900 px-4 py-14 text-center text-white sm:px-6">
          <h2 className="text-xl font-semibold sm:text-2xl">Listo para entrar</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-400 sm:text-base">
            Inicia sesión con las cuentas de demo o las credenciales de tu organización.
          </p>
          <Button
            asChild
            className="mt-8 h-11 rounded-full bg-white px-8 text-base font-medium text-neutral-900 hover:bg-neutral-100"
          >
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t border-neutral-200/80 py-6 text-center text-xs text-neutral-500">
        PulseVote · Encuestas en tiempo real
      </footer>
    </div>
  )
}
