import { CheckCircle2, Vote } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { PollCard } from '@/components/polls/PollCard'
import { VoteOption } from '@/components/polls/VoteOption'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionContainer } from '@/components/layout/SectionContainer'
import { EmptyState } from '@/components/states/EmptyState'
import { ErrorState } from '@/components/states/ErrorState'
import { LoadingState } from '@/components/states/LoadingState'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { usePolls } from '@/hooks/usePolls'
import { pollService } from '@/services/pollService'
import { getErrorMessage } from '@/services/api'
import type { Poll } from '@/types/poll'

export function UserPollsPage() {
  const { user } = useAuth()
  const { polls, isLoading, error, fetchPolls } = usePolls({ activeOnly: true })
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [voteError, setVoteError] = useState<string | null>(null)
  const [voteSuccess, setVoteSuccess] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [votedPollIds, setVotedPollIds] = useState<Set<string>>(new Set())

  const refreshVotedState = useCallback(() => {
    if (!user) return
    setVotedPollIds(
      new Set(
        polls
          .filter((p) => pollService.hasVoted(user.id, p.id, p) || p.hasVoted)
          .map((p) => p.id),
      ),
    )
  }, [polls, user])

  useEffect(() => {
    refreshVotedState()
  }, [refreshVotedState])

  const hasVoted = (pollId: string) => {
    if (votedPollIds.has(pollId)) return true
    const poll = polls.find((p) => p.id === pollId)
    return user ? pollService.hasVoted(user.id, pollId, poll) : false
  }

  const openVoteDialog = (poll: Poll) => {
    setSelectedPoll(poll)
    setSelectedOptionId(null)
    setVoteError(null)
  }

  const submitVote = async () => {
    if (!selectedPoll || !user) return
    if (!selectedOptionId) {
      setVoteError('Selecciona una opción antes de votar.')
      return
    }

    setIsVoting(true)
    setVoteError(null)
    try {
      await pollService.vote(selectedPoll.id, { optionId: selectedOptionId }, user.id)
      setVotedPollIds((prev) => new Set(prev).add(selectedPoll.id))
      setVoteSuccess(`¡Gracias! Tu voto en "${selectedPoll.question}" fue registrado.`)
      setSelectedPoll(null)
      await fetchPolls()
      setTimeout(() => setVoteSuccess(null), 4000)
    } catch (err) {
      setVoteError(getErrorMessage(err))
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <SectionContainer>
      <PageHeader
        title="Encuestas activas"
        description="Participa en las encuestas disponibles. Solo puedes votar una vez por encuesta."
      />

      {voteSuccess && (
        <Alert variant="success">
          <AlertDescription className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {voteSuccess}
          </AlertDescription>
        </Alert>
      )}

      {isLoading && <LoadingState message="Cargando encuestas activas..." />}
      {!isLoading && error && <ErrorState message={error} onRetry={fetchPolls} />}
      {!isLoading && !error && polls.length === 0 && (
        <EmptyState
          icon={Vote}
          title="No hay encuestas activas"
          description="Vuelve más tarde. El administrador publicará nuevas encuestas pronto."
        />
      )}
      {!isLoading && !error && polls.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              variant="user"
              hasVoted={hasVoted(poll.id)}
              onVoteClick={() => openVoteDialog(poll)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selectedPoll} onOpenChange={(open) => !open && setSelectedPoll(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pr-8">{selectedPoll?.question}</DialogTitle>
            <DialogDescription>Selecciona una opción y confirma tu voto.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            {selectedPoll?.options.map((option) => (
              <VoteOption
                key={option.id}
                id={option.id}
                text={option.text}
                selected={selectedOptionId === option.id}
                onSelect={setSelectedOptionId}
              />
            ))}
          </div>

          {voteError && (
            <Alert variant="destructive">
              <AlertDescription>{voteError}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedPoll(null)} disabled={isVoting}>
              Cancelar
            </Button>
            <Button onClick={() => void submitVote()} disabled={isVoting}>
              {isVoting ? 'Enviando voto...' : 'Confirmar voto'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SectionContainer>
  )
}
