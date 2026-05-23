import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SpinnerProps {
  className?: string
  label?: string
}

export function Spinner({ className, label = 'Cargando' }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2" role="status" aria-live="polite">
      <Loader2 className={cn('h-8 w-8 animate-spin text-primary', className)} />
      <span className="sr-only">{label}</span>
    </div>
  )
}
