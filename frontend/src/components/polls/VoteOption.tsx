import { CheckCircle2 } from 'lucide-react'
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
        'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all',
        selected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
          selected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40',
        )}
      >
        {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
      </span>
      <span className="font-medium text-foreground">{text}</span>
    </button>
  )
}
