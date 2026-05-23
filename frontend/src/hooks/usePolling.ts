import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '@/services/api'

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
  const onTickRef = useRef(onTick)

  fetcherRef.current = fetcher
  onTickRef.current = onTick

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true)
    else setIsRefreshing(true)

    try {
      onTickRef.current?.()
      const result = await fetcherRef.current()
      setData(result)
      setLastUpdated(new Date().toISOString())
      setError(null)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron actualizar los datos.'))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    void refresh(false)
    const id = window.setInterval(() => void refresh(true), intervalMs)
    return () => window.clearInterval(id)
  }, [enabled, intervalMs, refresh])

  return { data, isLoading, isRefreshing, error, lastUpdated, refresh }
}
