import { BarChart2, Pencil, Power, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatNumber } from '@/utils/formatters'
import type { Poll } from '@/types/poll'

interface PollCardProps {
  poll: Poll
  variant?: 'admin' | 'user'
  hasVoted?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleActive?: () => void
  onViewResults?: () => void
  onVoteClick?: () => void
}

export function PollCard({
  poll,
  variant = 'admin',
  hasVoted,
  onEdit,
  onDelete,
  onToggleActive,
  onViewResults,
  onVoteClick,
}: PollCardProps) {
  return (
    <Card className="transition-colors hover:border-primary/25">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge variant={poll.isActive ? 'success' : 'outline'}>
              {poll.isActive ? 'Activa' : 'Inactiva'}
            </Badge>
            {variant === 'user' && hasVoted && (
              <Badge variant="secondary">Ya votaste</Badge>
            )}
          </div>
          <CardTitle className="text-base leading-snug text-foreground">{poll.question}</CardTitle>
        </div>
        {variant === 'admin' && (
          <div className="flex shrink-0 gap-0.5">
            {onViewResults && (
              <Button variant="ghost" size="icon" onClick={onViewResults} aria-label="Ver resultados">
                <BarChart2 className="h-4 w-4" />
              </Button>
            )}
            {onToggleActive && (
              <Button variant="ghost" size="icon" onClick={onToggleActive} aria-label="Activar/desactivar">
                <Power className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Editar">
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Eliminar">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {poll.options.length} opciones · {formatNumber(poll.totalVotes)} votos
        </p>
        {variant === 'user' && onVoteClick && (
          <Button
            className="mt-4 w-full sm:w-auto"
            onClick={onVoteClick}
            disabled={hasVoted || !poll.isActive}
            variant={hasVoted ? 'secondary' : 'default'}
          >
            {hasVoted ? 'Voto registrado' : poll.isActive ? 'Participar' : 'Encuesta cerrada'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
