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
    <section className="relative border-t border-[#12382B]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-[#F3FFF8] sm:text-3xl">
            ¿Cómo funciona?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#8FA99B]">
            Un flujo simple en tres pasos: crear, votar y ver resultados en tiempo real.
          </p>
        </div>

        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map(({ step, icon: Icon, title, description, role }) => (
            <li key={step}>
              <article className="landing-surface-card flex h-full flex-col p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#00B86B]">
                    {role === 'LIVE' ? 'Tiempo real' : `Rol ${role}`}
                  </span>
                  <span className="font-mono text-sm text-[#8FA99B]">{step}</span>
                </div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#12382B] bg-[#0B241B] text-[#00F58A]">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-[#F3FFF8]">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#8FA99B]">{description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
