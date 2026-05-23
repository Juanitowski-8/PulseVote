import { useTheme } from '@/context/ThemeContext'

export function PremiumLedBackground() {
  const { isDark } = useTheme()
  if (!isDark) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
      aria-hidden
    >
      {/* Orbes LED animados */}
      <div className="led-orb led-orb-1 absolute -left-[20%] top-[10%] h-[55vh] w-[55vh] rounded-full" />
      <div className="led-orb led-orb-2 absolute -right-[15%] top-[25%] h-[45vh] w-[45vh] rounded-full" />
      <div className="led-orb led-orb-3 absolute bottom-[15%] left-[20%] h-[50vh] w-[50vh] rounded-full" />
      <div className="led-orb led-orb-4 absolute bottom-[5%] right-[10%] h-[35vh] w-[35vh] rounded-full" />

      {/* Haz central inferior — refuerzo horizonte */}
      <div className="led-horizon absolute bottom-0 left-1/2 h-[45vh] w-[80vw] -translate-x-1/2" />

      {/* Rejilla técnica en movimiento */}
      <div className="led-grid absolute inset-0 opacity-[0.35]" />

      {/* Ruido fino para textura premium */}
      <div className="led-noise absolute inset-0 opacity-[0.04]" />

      {/* Viñeta elegante */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000000_72%)]" />
    </div>
  )
}
