import { useCallback, useEffect, useRef, useState } from 'react'

interface UsePollingOptions<T> {
  fetcher: () => Promise<T>
  intervalMs?: number
  enabled?: boolean
  onTick?: () => void
}

export function usePolling<T>({
  fetcher,
  intervalMs = 3000,
  enabled = true,
  onTick,
}: UsePollingOptions<T>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const fetcherRef = useRef(fetcher)

  fetcherRef.current = fetcher

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true)
    else setIsRefreshing(true)

    try {
      onTick?.()
      const result = await fetcherRef.current()
      setData(result)
      setLastUpdated(new Date().toISOString())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar datos')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [onTick])

  useEffect(() => {
    if (!enabled) return

    void refresh(false)
    const id = window.setInterval(() => void refresh(true), intervalMs)
    return () => window.clearInterval(id)
  }, [enabled, intervalMs, refresh])

  return { data, isLoading, isRefreshing, error, lastUpdated, refresh }
}
