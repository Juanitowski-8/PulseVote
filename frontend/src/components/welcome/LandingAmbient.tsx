/** Galaxia neón premium — cosmos verde/cyan con estrellas y nebulosas en movimiento */
export function LandingAmbient() {
  return (
    <div
      className="landing-galaxy-root pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Espacio profundo */}
      <div className="landing-galaxy-deep absolute inset-0" />

      {/* Brazos espirales de la galaxia */}
      <div className="landing-galaxy-spiral landing-galaxy-spiral-a absolute inset-[-40%]" />
      <div className="landing-galaxy-spiral landing-galaxy-spiral-b absolute inset-[-35%]" />

      {/* Nebulosas de gas neón */}
      <div className="landing-nebula landing-nebula-emerald absolute -left-[15%] -top-[20%] h-[100vmin] w-[100vmin]" />
      <div className="landing-nebula landing-nebula-cyan absolute -bottom-[30%] -right-[12%] h-[105vmin] w-[105vmin]" />
      <div className="landing-nebula landing-nebula-lime absolute left-[18%] top-[32%] h-[70vmin] w-[70vmin]" />
      <div className="landing-nebula landing-nebula-violet absolute -right-[5%] top-[5%] h-[55vmin] w-[55vmin]" />
      <div className="landing-nebula landing-nebula-teal absolute bottom-[10%] left-[35%] h-[60vmin] w-[60vmin]" />

      {/* Núcleo galáctico */}
      <div className="landing-galaxy-core absolute left-1/2 top-[38%] h-[min(70vmin,560px)] w-[min(90vw,820px)] -translate-x-1/2" />

      {/* Anillo de polvo luminoso */}
      <div className="landing-galaxy-ring absolute left-1/2 top-[42%] h-[80vmin] w-[80vmin] -translate-x-1/2" />

      {/* Campo de estrellas */}
      <div className="landing-stars-far absolute inset-0" />
      <div className="landing-stars-near absolute inset-0" />

      {/* Aurora cósmica */}
      <div className="landing-galaxy-aurora absolute inset-0" />

      <div className="landing-grain absolute inset-0" />
      <div className="landing-vignette-cosmos absolute inset-0" />
    </div>
  )
}
