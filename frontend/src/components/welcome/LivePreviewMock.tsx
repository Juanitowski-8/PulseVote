import { useEffect, useState } from 'react'
import { Radio } from 'lucide-react'

const options = [
  { label: 'Polling cada 3s', pct: 52 },
  { label: 'WebSockets', pct: 31 },
  { label: 'SSE', pct: 17 },
]

export function LivePreviewMock() {
  const [votes, setVotes] = useState(47)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => {
      setVotes((v) => v + Math.floor(Math.random() * 3) + 1)
      setPulse(true)
      window.setTimeout(() => setPulse(false), 600)
    }, 3000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-lg shadow-neutral-200/40">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Vista previa</p>
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 transition-opacity ${pulse ? 'opacity-100' : 'opacity-70'}`}
        >
          <Radio className={`h-3 w-3 ${pulse ? 'animate-pulse' : ''}`} aria-hidden />
          En vivo
        </span>
      </div>
      <p className="text-sm font-semibold text-neutral-900">
        ¿Cómo actualizar resultados en tiempo real?
      </p>
      <p className="mt-1 text-xs text-neutral-500">{votes} votos totales</p>
      <div className="mt-4 space-y-3">
        {options.map((opt) => (
          <div key={opt.label}>
            <div className="mb-1 flex justify-between text-xs text-neutral-600">
              <span>{opt.label}</span>
              <span>{opt.pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-neutral-800 transition-all duration-700 ease-out"
                style={{ width: `${opt.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
