import { BarChart3, ClipboardList, Vote } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'El administrador crea',
    description: 'Define la pregunta, las opciones y publica encuestas activas desde un panel de gestión.',
    role: 'ADMIN',
  },
  {
    step: '02',
    icon: Vote,
    title: 'El usuario vota',
    description: 'Los participantes ven encuestas activas, eligen una opción y confirman su voto (una vez por encuesta).',
    role: 'USER',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'El dashboard se actualiza en vivo',
    description: 'Los resultados se refrescan automáticamente a medida que llegan votos, sin recargar la página.',
    role: 'LIVE',
  },
]

export function HowItWorks() {
  return (
    <section className="border-t border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
            ¿Cómo funciona?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Un flujo simple en tres pasos: crear, votar y ver resultados en tiempo real.
          </p>
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map(({ step, icon: Icon, title, description, role }, index) => (
            <li key={step} className="relative">
              {index < steps.length - 1 && (
                <span
                  className="absolute right-0 top-12 hidden h-px w-6 translate-x-full bg-neutral-200 dark:bg-neutral-700 md:block lg:w-10"
                  aria-hidden
                />
              )}
              <article className="flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-[#fafafa] p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {role === 'LIVE' ? 'Tiempo real' : `Rol ${role}`}
                  </span>
                  <span className="font-mono text-sm text-neutral-400 dark:text-neutral-500">{step}</span>
                </div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-emerald-600">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {description}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
