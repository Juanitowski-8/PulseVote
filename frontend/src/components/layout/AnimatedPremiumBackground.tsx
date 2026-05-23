/** Fondo landing: auroras verdes sutiles en claro y oscuro. */
export function AnimatedPremiumBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-pv-background"
    >
      <div
        className="pv-aurora absolute -left-1/4 top-0 h-[55vh] w-[70%] rounded-full opacity-40 blur-3xl motion-safe:animate-pulse dark:opacity-30"
        style={{ background: 'rgb(var(--aurora) / 0.14)' }}
      />
      <div
        className="pv-aurora absolute -right-1/4 top-[10%] h-[45vh] w-[60%] rounded-full opacity-30 blur-3xl motion-safe:animate-pulse dark:opacity-20"
        style={{
          background: 'rgb(var(--primary-medium) / 0.1)',
          animationDelay: '1.2s',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgb(var(--primary)/0.09),transparent_50%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgb(var(--primary)/0.07),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgb(var(--background)/0.92)_85%)]" />
    </div>
  )
}
