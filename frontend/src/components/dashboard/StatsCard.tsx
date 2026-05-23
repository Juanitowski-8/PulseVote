import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber } from '@/utils/formatters'
import { cn } from '@/utils/cn'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  suffix?: string
  trend?: string
  className?: string
}

export function StatsCard({ title, value, icon: Icon, suffix, trend, className }: StatsCardProps) {
  const display = typeof value === 'number' ? formatNumber(value) : value

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {display}
            {suffix && (
              <span className="ml-1 text-base font-normal text-muted-foreground">{suffix}</span>
            )}
          </p>
          {trend && (
            <p className="mt-1.5 text-xs font-medium text-primary">{trend}</p>
          )}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
          <Icon className="h-5 w-5 text-primary" aria-hidden />
        </div>
      </CardContent>
    </Card>
  )
}
