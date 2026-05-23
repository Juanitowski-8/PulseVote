import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPercentage } from '@/utils/formatters'
import type { PollResults } from '@/types/poll'

interface PollResultsChartProps {
  results: PollResults
}

export function PollResultsChart({ results }: PollResultsChartProps) {
  const chartData = results.options.map((o) => ({
    name: o.text.length > 24 ? `${o.text.slice(0, 24)}…` : o.text,
    fullName: o.text,
    votes: o.votes,
    percentage: o.percentage,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Distribución de votos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-card)',
                }}
                formatter={(value, _name, item) => {
                  const votes = typeof value === 'number' ? value : 0
                  const payload = item?.payload as { fullName: string; percentage: number }
                  return [
                    `${votes} votos (${formatPercentage(payload?.percentage ?? 0)})`,
                    payload?.fullName ?? '',
                  ]
                }}
              />
              <Bar dataKey="votes" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
