/** Fondo oscuro premium — auroras verdes suaves, grain y movimiento lento (landing) */
export function AnimatedPremiumBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020D0A]"
    >
      {/* Gradientes radiales base */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,245,138,0.14),transparent_34%),radial-gradient(circle_at_15%_20%,rgba(0,184,107,0.12),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(0,107,69,0.2),transparent_32%)]"
      />

      {/* Blobs con blur y animación lenta */}
      <div className="absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#00F58A]/18 blur-[120px] animate-pulsevote-float" />

      <div className="absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-[#00B86B]/20 blur-[140px] animate-pulsevote-float-delayed" />

      <div className="absolute -bottom-8 -left-32 h-[24rem] w-[24rem] rounded-full bg-[#006B45]/28 blur-[120px] animate-pulsevote-float-slow" />

      {/* Rejilla muy sutil */}
      <div
        className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(rgba(243,255,248,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(243,255,248,0.035)_1px,transparent_1px)] bg-[size:72px_72px]"
      />

      {/* Noise / textura fina */}
      <div className="landing-premium-noise absolute inset-0" />

      {/* Overlay de contraste para legibilidad */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,13,10,0.12),rgba(2,13,10,0.65)_70%,#020D0A)]" />
    </div>
  )
}
