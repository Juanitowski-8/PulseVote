/** Fondo landing — grid + spotlight + viñeta + puntos neón en modo claro. */
const LIGHT_NEON_DOTS = [
  { top: '7%', left: '5%', size: 5, glow: 10, duration: 2.6, delay: 0.1 },
  { top: '12%', left: '18%', size: 3, glow: 8, duration: 3.4, delay: 1.2 },
  { top: '9%', left: '34%', size: 4, glow: 9, duration: 2.9, delay: 0.6 },
  { top: '16%', left: '52%', size: 3, glow: 7, duration: 4.1, delay: 2.0 },
  { top: '11%', left: '72%', size: 5, glow: 11, duration: 3.1, delay: 0.9 },
  { top: '8%', left: '88%', size: 4, glow: 9, duration: 3.8, delay: 1.7 },
  { top: '28%', left: '8%', size: 4, glow: 10, duration: 2.4, delay: 0.3 },
  { top: '34%', left: '92%', size: 5, glow: 12, duration: 3.6, delay: 1.4 },
  { top: '48%', left: '4%', size: 3, glow: 8, duration: 4.4, delay: 2.3 },
  { top: '52%', left: '96%', size: 4, glow: 9, duration: 2.8, delay: 0.5 },
  { top: '62%', left: '14%', size: 3, glow: 7, duration: 3.3, delay: 1.1 },
  { top: '58%', left: '78%', size: 4, glow: 10, duration: 3.9, delay: 1.9 },
  { top: '72%', left: '22%', size: 5, glow: 11, duration: 2.5, delay: 0.2 },
  { top: '68%', left: '58%', size: 3, glow: 8, duration: 4.0, delay: 2.1 },
  { top: '78%', left: '86%', size: 4, glow: 9, duration: 3.0, delay: 0.8 },
  { top: '84%', left: '42%', size: 3, glow: 7, duration: 3.5, delay: 1.5 },
] as const

export function AnimatedPremiumBackground() {
  return (
    <div aria-hidden className="pv-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="pv-bg-grid absolute inset-0" />
      <div className="pv-bg-spotlight absolute inset-0" />
      <div className="pv-bg-aurora pv-bg-aurora-bl absolute -bottom-[20%] -left-[14%] h-[min(540px,72vw)] w-[min(540px,72vw)] rounded-full blur-[110px]" />
      <div className="pv-bg-aurora pv-bg-aurora-br absolute -bottom-[16%] -right-[12%] h-[min(500px,68vw)] w-[min(500px,68vw)] rounded-full blur-[110px]" />
      <div className="pv-bg-aurora pv-bg-aurora-tc absolute -top-[12%] left-1/2 h-[min(380px,50vw)] w-[min(720px,90vw)] -translate-x-1/2 rounded-full blur-[100px]" />

      {/* Puntos verde neón — solo modo claro */}
      <div className="pv-bg-neon-dots absolute inset-0 dark:hidden">
        {LIGHT_NEON_DOTS.map((dot, index) => (
          <span
            key={index}
            className="pv-bg-neon-dot absolute rounded-full"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              ['--dot-glow' as string]: `${dot.glow}px`,
              ['--dot-duration' as string]: `${dot.duration}s`,
              ['--dot-delay' as string]: `${dot.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="pv-bg-vignette absolute inset-0" />
      <div className="pv-bg-floor absolute inset-0" />
    </div>
  )
}
