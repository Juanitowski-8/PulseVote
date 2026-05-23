/** Fondo premium — base verde luminosa, neón en movimiento (sin negro plano) */
export function LandingAmbient() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#062818]"
      aria-hidden
    >
      {/* Base: degradado verde profundo animado (rellena toda la pantalla) */}
      <div className="landing-base-gradient absolute inset-0" />

      {/* Tinte verde lima en toda la superficie */}
      <div className="landing-green-wash absolute inset-0" />

      {/* Mesh neón animado */}
      <div className="landing-neon-mesh absolute inset-0" />

      {/* Blobs neón grandes */}
      <div className="landing-neon-blob landing-neon-blob-tl absolute -left-[18%] -top-[22%] h-[95vmin] w-[95vmin]" />
      <div className="landing-neon-blob landing-neon-blob-br absolute -bottom-[28%] -right-[14%] h-[100vmin] w-[100vmin]" />
      <div className="landing-neon-blob landing-neon-blob-mid absolute left-[22%] top-[38%] h-[65vmin] w-[65vmin]" />
      <div className="landing-neon-blob landing-neon-blob-tr absolute -right-[8%] top-[8%] h-[50vmin] w-[50vmin]" />

      {/* Núcleo detrás del hero */}
      <div className="landing-neon-core absolute left-1/2 top-[40%] h-[55vmin] w-[min(95vw,800px)] -translate-x-1/2" />

      <div className="landing-neon-sweep absolute inset-0" />
      <div className="landing-neon-rim absolute inset-x-0 top-0 h-[45vh]" />

      <div className="landing-grain absolute inset-0" />
      <div className="landing-vignette absolute inset-0" />
    </div>
  )
}
