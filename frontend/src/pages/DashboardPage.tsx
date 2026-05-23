import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  ClipboardList,
  Radio,
  Users,
} from 'lucide-react'
import { PollResultsChart } from '@/components/dashboard/PollResultsChart'
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionContainer } from '@/components/layout/SectionContainer'
import { ErrorState } from '@/components/states/ErrorState'
import { LoadingState } from '@/components/states/LoadingState'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePolling } from '@/hooks/usePolling'
import { pollService } from '@/services/pollService'
import { formatNumber, formatPercentage, formatRelativeTime } from '@/utils/formatters'
import type { DashboardSummary, PollResults } from '@/types/poll'

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pollFromUrl = searchParams.get('poll')

  const summaryFetcher = useCallback(async () => {
    return pollService.getDashboardSummary()
  }, [])

  const {
    data: summary,
    isLoading,
    isRefreshing,
    error: summaryError,
    lastUpdated,
    refresh: refreshSummary,
  } = usePolling<DashboardSummary>({
    fetcher: summaryFetcher,
    intervalMs: 3000,
    onTick: () => pollService.simulateLiveTick(),
  })

  const [selectedPollId, setSelectedPollId] = useState<string>('')

  useEffect(() => {
    if (summary?.polls.length) {
      const exists = summary.polls.some((p) => p.id === selectedPollId)
      if (!exists) {
        const initial = pollFromUrl && summary.polls.some((p) => p.id === pollFromUrl)
          ? pollFromUrl
          : summary.polls[0].id
        setSelectedPollId(initial)
      }
    }
  }, [summary, selectedPollId, pollFromUrl])

  const resultsFetcher = useCallback(async () => {
    if (!selectedPollId) throw new Error('Sin encuesta seleccionada')
    return pollService.getDashboardPollResults(selectedPollId)
  }, [selectedPollId])

  const {
    data: results,
    isLoading: resultsLoading,
    error: resultsError,
    lastUpdated: resultsUpdated,
  } = usePolling<PollResults>({
    fetcher: resultsFetcher,
    intervalMs: 3000,
    enabled: !!selectedPollId,
    onTick: () => pollService.simulateLiveTick(),
  })

  const handlePollChange = (id: string) => {
    setSelectedPollId(id)
    setSearchParams({ poll: id })
  }

  const tableRows = useMemo(() => results?.options ?? [], [results])

  if (isLoading && !summary) {
    return <LoadingState message="Cargando dashboard..." />
  }

  if (summaryError && !summary) {
    return <ErrorState message={summaryError} onRetry={() => void refreshSummary()} />
  }

  return (
    <SectionContainer>
      <PageHeader
        title="Dashboard analítico"
        description="Resultados en tiempo real con actualización automática cada 3 segundos."
        action={
          <Badge variant="success" className="flex items-center gap-1.5 px-3 py-1">
            <Radio className={isRefreshing ? 'h-3 w-3 animate-pulse' : 'h-3 w-3'} />
            {isRefreshing ? 'Actualizando...' : 'En vivo'}
          </Badge>
        }
      />

      {lastUpdated && (
        <p className="-mt-4 text-xs text-muted-foreground">
          Última actualización: {formatRelativeTime(lastUpdated)}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total encuestas"
          value={summary?.totalPolls ?? 0}
          icon={ClipboardList}
        />
        <StatsCard title="Total votos" value={summary?.totalVotes ?? 0} icon={Users} />
        <StatsCard title="Encuestas activas" value={summary?.activePolls ?? 0} icon={Activity} />
        <StatsCard
          title="Participación media"
          value={summary?.averageParticipation ?? 0}
          suffix="votos/encuesta"
          icon={BarChart3}
          trend="Promedio del conjunto"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <p className="mb-2 text-sm font-medium">Encuesta seleccionada</p>
          <Select value={selectedPollId} onValueChange={handlePollChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una encuesta" />
            </SelectTrigger>
            <SelectContent>
              {summary?.polls.map((poll) => (
                <SelectItem key={poll.id} value={poll.id}>
                  {poll.question}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {resultsLoading && !results ? (
            <LoadingState message="Cargando resultados..." />
          ) : resultsError ? (
            <ErrorState message={resultsError} />
          ) : results ? (
            <>
              <PollResultsChart results={results} />
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Detalle de resultados</CardTitle>
                  {resultsUpdated && (
                    <p className="text-xs text-muted-foreground">
                      Actualizado {formatRelativeTime(resultsUpdated)}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full min-w-[400px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="pb-3 font-medium">Opción</th>
                        <th className="pb-3 font-medium">Votos</th>
                        <th className="pb-3 font-medium">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row) => (
                        <tr key={row.optionId} className="border-b border-border/60 last:border-0">
                          <td className="py-3 pr-4 font-medium">{row.text}</td>
                          <td className="py-3">{formatNumber(row.votes)}</td>
                          <td className="py-3 text-primary">{formatPercentage(row.percentage)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="pt-3 font-semibold">Total</td>
                        <td className="pt-3 font-semibold" colSpan={2}>
                          {formatNumber(results.totalVotes)} votos
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
        <div>
          {summary && <RecentActivityCard polls={summary.polls} />}
        </div>
      </div>
    </SectionContainer>
  )
}
