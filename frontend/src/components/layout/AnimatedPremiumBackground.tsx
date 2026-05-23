/** Fondo landing: grid sutil + auroras verdes + viñeta (claro y oscuro). */
export function AnimatedPremiumBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-pv-background"
    >
      {/* Cuadrícula tipo blueprint */}
      <div className="pv-landing-grid absolute inset-0" />

      {/* Aurora inferior izquierda */}
      <div
        className="pv-landing-aurora absolute -bottom-[18%] -left-[12%] h-[min(520px,70vw)] w-[min(520px,70vw)] rounded-full blur-[100px]"
        style={{ background: 'rgb(var(--primary) / 0.22)' }}
      />

      {/* Aurora inferior derecha */}
      <div
        className="pv-landing-aurora absolute -bottom-[14%] -right-[10%] h-[min(480px,65vw)] w-[min(480px,65vw)] rounded-full blur-[100px]"
        style={{ background: 'rgb(var(--primary-medium) / 0.18)' }}
      />

      {/* Glow superior detrás del hero */}
      <div
        className="pv-landing-aurora absolute -top-[8%] left-[8%] h-[min(420px,55vw)] w-[min(560px,75vw)] rounded-full blur-[90px] lg:left-[12%]"
        style={{ background: 'rgb(var(--primary) / 0.14)' }}
      />

      {/* Halo central suave */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_42%_28%,rgb(var(--primary)/0.11),transparent_58%)] dark:bg-[radial-gradient(ellipse_90%_55%_at_42%_28%,rgb(var(--primary)/0.16),transparent_58%)]" />

      {/* Viñeta: centro más oscuro, bordes con luz */}
      <div className="pv-landing-vignette absolute inset-0" />

      {/* Degradado inferior para anclar contenido */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgb(var(--background)/0.35)_55%,rgb(var(--background)/0.92)_100%)]" />
    </div>
  )
}
