import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeTime } from '@/utils/formatters'
import type { Poll } from '@/types/poll'

interface RecentActivityCardProps {
  polls: Poll[]
}

export function RecentActivityCard({ polls }: RecentActivityCardProps) {
  const recent = [...polls]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-primary" />
          Actividad reciente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin actividad reciente.</p>
        ) : (
          recent.map((poll) => (
            <div
              key={poll.id}
              className="flex items-start justify-between gap-2 border-b border-border/60 pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{poll.question}</p>
                <p className="text-xs text-muted-foreground">
                  {poll.totalVotes} votos · {poll.isActive ? 'Activa' : 'Inactiva'}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelativeTime(poll.updatedAt)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
