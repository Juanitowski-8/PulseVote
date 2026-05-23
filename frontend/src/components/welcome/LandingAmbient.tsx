/** Fondo landing — auroras verdes suaves, grain cinematográfico y movimiento lento */
export function LandingAmbient() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030303]" aria-hidden>
      {/* Base con ligero degradado central */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_40%,#0a120e_0%,#030303_55%,#020202_100%)]" />

      {/* Nebulosa superior izquierda (estilo referencia pricing) */}
      <div className="landing-glow-tl absolute -left-[15%] -top-[20%] h-[70vmin] w-[70vmin] rounded-full" />

      {/* Nebulosa inferior derecha */}
      <div className="landing-glow-br absolute -bottom-[25%] -right-[10%] h-[75vmin] w-[75vmin] rounded-full" />

      {/* Halo central muy tenue */}
      <div className="landing-glow-center absolute left-1/2 top-[38%] h-[50vmin] w-[50vmin] -translate-x-1/2 rounded-full" />

      {/* Textura grain */}
      <div className="landing-grain absolute inset-0" />

      {/* Viñeta para profundidad */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_45%,transparent_35%,#030303_100%)]" />
    </div>
  )
}
