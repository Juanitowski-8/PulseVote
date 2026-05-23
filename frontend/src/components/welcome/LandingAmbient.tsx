/** Fondo ambiental muy sutil — sin matrix ni orbes ruidosos */
export function LandingAmbient() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020D0A]" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-8%,rgba(0,245,138,0.07),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(0,107,69,0.05),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(143,169,155,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(143,169,155,0.4) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}
