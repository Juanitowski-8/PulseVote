/** Fondo premium — neón verde, grain cinematográfico y movimiento fluido */
export function LandingAmbient() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020202]" aria-hidden>
      {/* Base profunda */}
      <div className="absolute inset-0 bg-[#020202]" />

      {/* Mesh neón animado (capa principal, estilo referencia) */}
      <div className="landing-neon-mesh absolute inset-0" />

      {/* Blobs neón grandes con blur */}
      <div className="landing-neon-blob landing-neon-blob-tl absolute -left-[20%] -top-[28%] h-[85vmin] w-[85vmin]" />
      <div className="landing-neon-blob landing-neon-blob-br absolute -bottom-[32%] -right-[18%] h-[90vmin] w-[90vmin]" />
      <div className="landing-neon-blob landing-neon-blob-mid absolute left-[30%] top-[42%] h-[55vmin] w-[55vmin]" />

      {/* Núcleo brillante detrás del hero */}
      <div className="landing-neon-core absolute left-1/2 top-[42%] h-[42vmin] w-[min(90vw,720px)] -translate-x-1/2" />

      {/* Barrido de luz diagonal */}
      <div className="landing-neon-sweep absolute inset-0" />

      {/* Halo de borde superior (rim light) */}
      <div className="landing-neon-rim absolute inset-x-0 top-0 h-[40vh]" />

      {/* Grain + viñeta */}
      <div className="landing-grain absolute inset-0" />
      <div className="landing-vignette absolute inset-0" />
    </div>
  )
}
