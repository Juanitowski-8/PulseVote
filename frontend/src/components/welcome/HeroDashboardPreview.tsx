import { Activity, BarChart3, Users } from 'lucide-react'

const stats = [
  { label: 'Votos hoy', value: '1,284', hint: '+12% vs ayer', icon: Activity },
  { label: 'Encuestas activas', value: '8', hint: '3 en curso', icon: BarChart3 },
  { label: 'Participantes', value: '326', hint: 'Última hora', icon: Users },
]

const pollOptions = [
  { label: 'Polling cada 3s', pct: 52, votes: 668 },
  { label: 'WebSockets', pct: 31, votes: 398 },
  { label: 'SSE', pct: 17, votes: 218 },
]

export function HeroDashboardPreview() {
  return (
    <div className="w-full">
      <div className="mb-3 grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <div key={label} className="landing-surface-card px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-pv-muted">{label}</p>
              <Icon className="h-3.5 w-3.5 text-pv-primary" aria-hidden />
            </div>
            <p className="mt-1 text-xl font-semibold tracking-tight text-pv-main">{value}</p>
            <p className="mt-0.5 text-[11px] text-pv-muted">{hint}</p>
          </div>
        ))}
      </div>

      <div className="landing-surface-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-pv px-5 py-3.5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-pv-muted">
              Dashboard · Tiempo real
            </p>
            <p className="mt-0.5 text-sm font-medium text-pv-main">
              ¿Cómo actualizar resultados en vivo?
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-pv-surface-soft px-2.5 py-1 text-[11px] font-medium text-pv-primary shadow-sm shadow-primary/10">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--primary))]" aria-hidden />
            En vivo
          </span>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-[1fr_200px]">
          <div className="space-y-4">
            {pollOptions.map((opt) => (
              <div key={opt.label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="font-medium text-pv-main">{opt.label}</span>
                  <span className="tabular-nums text-pv-muted">
                    {opt.pct}% · {opt.votes}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full border border-primary/15 bg-pv-surface-soft">
                  <div
                    className="h-full rounded-full bg-[rgb(var(--primary-medium))]"
                    style={{ width: `${opt.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden rounded-xl border border-primary/35 bg-pv-surface-soft p-4 shadow-inner shadow-primary/5 sm:flex sm:flex-col sm:justify-between">
            <p className="text-xs font-medium text-pv-muted">Distribución</p>
            <div className="mt-3 flex items-end justify-center gap-2">
              {pollOptions.map((opt) => (
                <div key={opt.label} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 rounded-t-sm bg-[rgb(var(--primary-medium))]"
                    style={{ height: `${Math.max(opt.pct * 0.9, 12)}px` }}
                  />
                  <span className="text-[10px] text-pv-muted">{opt.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
