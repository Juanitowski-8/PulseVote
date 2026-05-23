import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'

interface VoteOptionProps {
  id: string
  text: string
  selected: boolean
  disabled?: boolean
  onSelect: (id: string) => void
}

export function VoteOption({ id, text, selected, disabled, onSelect }: VoteOptionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(id)}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-sm transition-colors',
        selected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card hover:border-primary/40 hover:bg-muted/50',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          selected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/50 bg-transparent',
        )}
      >
        {selected && <Check className="h-3 w-3" strokeWidth={3} aria-hidden />}
      </span>
      <span className="font-medium text-foreground">{text}</span>
    </button>
  )
}
