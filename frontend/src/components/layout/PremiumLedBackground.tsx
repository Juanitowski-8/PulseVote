import { useLocation } from 'react-router-dom'

/** Fondo app privada: superficie temática con aurora muy sutil. */
export function PremiumLedBackground() {
  const { pathname } = useLocation()
  if (pathname === '/') return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-background" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgb(var(--primary)/0.06),transparent_55%)] dark:bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgb(var(--primary)/0.04),transparent_55%)]" />
    </div>
  )
}
