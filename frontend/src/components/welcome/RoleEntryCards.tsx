import { Link } from 'react-router-dom'
import { Check, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <section className="border-t border-neutral-200/80 dark:border-white/10 dark:bg-black">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            ¿Qué quieres hacer?
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            Elige tu rol e inicia sesión para entrar directo a tu espacio.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {roles.map(({ icon: Icon, title, description, actions, cta, preset }) => (
            <article
              key={preset}
              className="flex flex-col rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-neutral-950/60 dark:hover:border-emerald-500/20 dark:hover:shadow-emerald-900/20"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950">
                <Icon className="h-5 w-5 text-emerald-800 dark:text-emerald-400" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
              <ul className="mt-4 space-y-2">
                {actions.map((action) => (
                  <li key={action} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                    {action}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-6 h-10 w-full rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                <Link to="/login" state={{ preset }}>{cta}</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
