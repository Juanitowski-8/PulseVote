import { Link } from 'react-router-dom'
import { Check, Shield, Users } from 'lucide-react'
import type { Role } from '@/types/auth'

const roles: Array<{
  role: Role
  icon: typeof Shield
  title: string
  description: string
  actions: string[]
  cta: string
  preset: 'admin' | 'user'
}> = [
  {
    role: 'ADMIN',
    icon: Shield,
    title: 'Soy administrador',
    description: 'Gestiona encuestas, activa o archiva preguntas y consulta el dashboard analítico.',
    actions: ['Crear y editar encuestas', 'Ver resultados en vivo', 'Métricas de participación'],
    cta: 'Entrar como admin',
    preset: 'admin',
  },
  {
    role: 'USER',
    icon: Users,
    title: 'Soy participante',
    description: 'Accede a las encuestas activas, vota una sola vez y consulta si ya participaste.',
    actions: ['Ver encuestas activas', 'Votar de forma segura', 'Confirmación de voto único'],
    cta: 'Entrar como usuario',
    preset: 'user',
  },
]

export function RoleEntryCards() {
  return (
    <section className="relative border-t border-[#12382B]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-[#F3FFF8] sm:text-3xl">
            ¿Qué quieres hacer?
          </h2>
          <p className="mt-3 text-[#8FA99B]">
            Elige tu rol e inicia sesión para entrar directo a tu espacio.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {roles.map(({ icon: Icon, title, description, actions, cta, preset }) => (
            <article
              key={preset}
              className="landing-surface-card flex flex-col p-6 transition-colors hover:border-[#00B86B]/35"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#12382B] bg-[#0B241B]">
                <Icon className="h-5 w-5 text-[#00B86B]" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-[#F3FFF8]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8FA99B]">{description}</p>
              <ul className="mt-5 space-y-2.5">
                {actions.map((action) => (
                  <li key={action} className="flex items-center gap-2.5 text-sm text-[#F3FFF8]">
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#00B86B]" aria-hidden />
                    {action}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                state={{ preset }}
                className="landing-btn-primary mt-6 inline-flex h-10 w-full items-center justify-center text-sm"
              >
                {cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
