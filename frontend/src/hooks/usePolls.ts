import { useCallback, useEffect, useState } from 'react'
import { pollService } from '@/services/pollService'
import { getErrorMessage } from '@/services/api'
import type { Poll, PollFormData } from '@/types/poll'

interface UsePollsOptions {
  activeOnly?: boolean
  autoFetch?: boolean
}

export function usePolls({ activeOnly = false, autoFetch = true }: UsePollsOptions = {}) {
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(autoFetch)
  const [error, setError] = useState<string | null>(null)

  const fetchPolls = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await pollService.getPolls(activeOnly)
      setPolls(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [activeOnly])

  useEffect(() => {
    if (autoFetch) void fetchPolls()
  }, [autoFetch, fetchPolls])

  const createPoll = async (data: PollFormData) => {
    const created = await pollService.createPoll(data)
    setPolls((prev) => [created, ...prev])
    return created
  }

  const updatePoll = async (id: string, data: PollFormData) => {
    const updated = await pollService.updatePoll(id, data)
    setPolls((prev) => prev.map((p) => (p.id === id ? updated : p)))
    return updated
  }

  const removePoll = async (id: string) => {
    await pollService.deletePoll(id)
    setPolls((prev) => prev.filter((p) => p.id !== id))
  }

  const toggleActive = async (id: string) => {
    const updated = await pollService.togglePollActive(id)
    setPolls((prev) => prev.map((p) => (p.id === id ? updated : p)))
    return updated
  }

  return {
    polls,
    isLoading,
    error,
    fetchPolls,
    createPoll,
    updatePoll,
    removePoll,
    toggleActive,
    setPolls,
  }
}
