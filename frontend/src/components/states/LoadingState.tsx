import { Spinner } from '@/components/ui/spinner'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Cargando...' }: LoadingStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 py-12">
      <Spinner />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
