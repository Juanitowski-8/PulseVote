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
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-3 grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-[#12382B] bg-[#071A14] px-4 py-3.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-[#8FA99B]">{label}</p>
              <Icon className="h-3.5 w-3.5 text-[#00B86B]" aria-hidden />
            </div>
            <p className="mt-1 text-xl font-semibold tracking-tight text-[#F3FFF8]">{value}</p>
            <p className="mt-0.5 text-[11px] text-[#8FA99B]">{hint}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#12382B] bg-[#071A14] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between border-b border-[#12382B] px-5 py-3.5">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#8FA99B]">
              Dashboard · Tiempo real
            </p>
            <p className="mt-0.5 text-sm font-medium text-[#F3FFF8]">
              ¿Cómo actualizar resultados en vivo?
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#12382B] bg-[#0B241B] px-2.5 py-1 text-[11px] font-medium text-[#00F58A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00F58A]" aria-hidden />
            En vivo
          </span>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-[1fr_200px]">
          <div className="space-y-4">
            {pollOptions.map((opt) => (
              <div key={opt.label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-[#F3FFF8]">{opt.label}</span>
                  <span className="tabular-nums text-[#8FA99B]">
                    {opt.pct}% · {opt.votes}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#0B241B]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00B86B] to-[#00F58A]"
                    style={{ width: `${opt.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden rounded-xl border border-[#12382B] bg-[#0B241B] p-4 sm:flex sm:flex-col sm:justify-between">
            <p className="text-xs font-medium text-[#8FA99B]">Distribución</p>
            <div className="mt-3 flex items-end justify-center gap-2">
              {pollOptions.map((opt) => (
                <div key={opt.label} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 rounded-t-sm bg-gradient-to-t from-[#006B45] to-[#00F58A]"
                    style={{ height: `${opt.pct * 0.9}px` }}
                  />
                  <span className="text-[10px] text-[#8FA99B]">{opt.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
