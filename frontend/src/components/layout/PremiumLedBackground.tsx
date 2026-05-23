import { useLocation } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'

/** Fondo global app (no landing): ambiente mínimo sin matrix */
export function PremiumLedBackground() {
  const { isDark } = useTheme()
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  if (!isDark || isLanding) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(16,185,129,0.06),transparent_60%)]" />
    </div>
  )
}
