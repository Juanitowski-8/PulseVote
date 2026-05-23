import { Spinner } from '@/components/ui/spinner'

interface RoutePageFallbackProps {
  message?: string
  fullScreen?: boolean
}

/** Fallback de Suspense al cargar rutas lazy (estética PulseVote). */
export function RoutePageFallback({
  message = 'Cargando...',
  fullScreen = false,
}: RoutePageFallbackProps) {
  return (
    <div
      className={
        fullScreen
          ? 'flex min-h-screen flex-col items-center justify-center gap-3 px-4'
          : 'flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 py-16'
      }
    >
      <Spinner />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
