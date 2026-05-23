import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BarChart3, Shield, Zap } from 'lucide-react'
import { WelcomeNavbar } from '@/components/layout/WelcomeNavbar'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/states/LoadingState'
import { useAuth } from '@/hooks/useAuth'

const features = [
  {
    icon: Zap,
    title: 'Resultados en vivo',
    description:
      'El dashboard se actualiza automáticamente cada pocos segundos, sin recargar la página.',
  },
  {
    icon: Shield,
    title: 'Voto único y roles',
    description:
      'Administradores gestionan encuestas; los usuarios votan una sola vez por encuesta de forma segura.',
  },
  {
    icon: BarChart3,
    title: 'Analítica clara',
    description:
      'Gráficas y métricas para entender la participación y las preferencias de tu audiencia al instante.',
  },
]

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
        <section className="mx-auto max-w-3xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24 sm:pb-28">
          <p className="mb-4 text-sm font-medium text-emerald-700">Encuestas en tiempo real</p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl sm:leading-[1.15]">
            Decisiones más claras,
            <br />
            <span className="text-neutral-500">con datos al instante.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            <strong className="font-medium text-neutral-800">PulseVote</strong> es una plataforma
            para crear encuestas, recoger votos y visualizar resultados en un dashboard moderno.
            Ideal para equipos, eventos y pruebas técnicas donde importan la velocidad y la claridad.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-11 w-full rounded-full bg-neutral-900 px-8 text-base font-medium text-white hover:bg-neutral-800 sm:w-auto"
            >
              <Link to="/login">Comenzar ahora</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 w-full rounded-full border-neutral-300 bg-white px-8 text-base font-medium text-neutral-800 hover:bg-neutral-50 sm:w-auto"
            >
              <Link to="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </section>

        <section className="border-t border-neutral-200/80 bg-white/50">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:grid-cols-3 sm:px-6 sm:py-20">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-neutral-200/80 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                  <Icon className="h-5 w-5 text-neutral-700" aria-hidden />
                </div>
                <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-4 pb-24 text-center sm:px-6">
          <p className="text-sm text-neutral-500">
            ¿Listo para probarlo? Usa las cuentas de demo en la pantalla de inicio de sesión.
          </p>
        </section>
      </main>

      <footer className="border-t border-neutral-200/80 py-6 text-center text-xs text-neutral-500">
        PulseVote · Plataforma de encuestas
      </footer>
    </div>
  )
}
