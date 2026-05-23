/** Fondo landing: gradiente sutil, sin ruido ni matrix */
export function AnimatedPremiumBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020D0A]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(0,245,138,0.07),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#020D0A_85%)]" />
    </div>
  )
}
