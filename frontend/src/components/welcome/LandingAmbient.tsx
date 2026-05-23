/** Fondo landing — ambiente futurista sutil con movimiento */
export function LandingAmbient() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020D0A]" aria-hidden>
      {/* Aurora superior */}
      <div className="landing-aurora-top absolute inset-0" />

      {/* Orbes flotantes */}
      <div className="landing-orb landing-orb-a absolute left-[12%] top-[18%] h-[280px] w-[280px] rounded-full bg-[#00F58A]/[0.04] blur-[80px]" />
      <div className="landing-orb landing-orb-b absolute bottom-[20%] right-[8%] h-[320px] w-[320px] rounded-full bg-[#006B45]/[0.06] blur-[90px]" />
      <div className="landing-orb landing-orb-c absolute left-[55%] top-[55%] h-[200px] w-[200px] rounded-full bg-[#00B86B]/[0.03] blur-[70px]" />

      {/* Rejilla en movimiento */}
      <div className="landing-grid-drift absolute inset-0 opacity-[0.04]" />

      {/* Perspectiva inferior (horizonte digital) */}
      <div className="landing-horizon absolute inset-x-0 bottom-0 h-[45%] opacity-30" />

      {/* Haz de luz que barre */}
      <div className="landing-beam absolute inset-0" />

      {/* Líneas de escaneo */}
      <div className="landing-scanline absolute inset-0" />

      {/* Viñeta */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,#020D0A_100%)]" />
    </div>
  )
}
