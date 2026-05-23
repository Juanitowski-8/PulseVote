import { Plus } from 'lucide-react'
import { useState } from 'react'
import { PollCard } from '@/components/polls/PollCard'
import { PollForm } from '@/components/polls/PollForm'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionContainer } from '@/components/layout/SectionContainer'
import { EmptyState } from '@/components/states/EmptyState'
import { ErrorState } from '@/components/states/ErrorState'
import { LoadingState } from '@/components/states/LoadingState'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { usePolls } from '@/hooks/usePolls'
import { getErrorMessage } from '@/services/api'
import type { Poll, PollFormData } from '@/types/poll'
import { ClipboardList } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AdminPollsPage() {
  const navigate = useNavigate()
  const { polls, isLoading, error, fetchPolls, createPoll, updatePoll, removePoll, toggleActive } =
    usePolls()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPoll, setEditingPoll] = useState<Poll | undefined>()
  const [actionError, setActionError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openCreate = () => {
    setEditingPoll(undefined)
    setDialogOpen(true)
    setActionError(null)
  }

  const openEdit = (poll: Poll) => {
    setEditingPoll(poll)
    setDialogOpen(true)
    setActionError(null)
  }

  const handleSubmit = async (data: PollFormData) => {
    try {
      if (editingPoll) {
        await updatePoll(editingPoll.id, data)
        setSuccessMessage('Encuesta actualizada correctamente.')
      } else {
        await createPoll(data)
        setSuccessMessage('Encuesta creada correctamente.')
      }
      setDialogOpen(false)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setActionError(getErrorMessage(err))
      throw err
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta encuesta? Esta acción no se puede deshacer.')) return
    setDeletingId(id)
    setActionError(null)
    try {
      await removePoll(id)
      setSuccessMessage('Encuesta eliminada.')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await toggleActive(id)
    } catch (err) {
      setActionError(getErrorMessage(err))
    }
  }

  return (
    <SectionContainer>
      <PageHeader
        title="Gestión de encuestas"
        description="Solo ves y gestionas las encuestas que tú has creado. Los participantes ven todas las publicadas."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nueva encuesta
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      {actionError && (
        <Alert variant="destructive">
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      {isLoading && <LoadingState message="Cargando encuestas..." />}
      {!isLoading && error && <ErrorState message={error} onRetry={fetchPolls} />}
      {!isLoading && !error && polls.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No hay encuestas"
          description="Crea tu primera encuesta para empezar a recopilar votos."
          action={{ label: 'Crear encuesta', onClick: openCreate }}
        />
      )}
      {!isLoading && !error && polls.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              variant="admin"
              onEdit={() => openEdit(poll)}
              onDelete={() => void handleDelete(poll.id)}
              onToggleActive={() => void handleToggle(poll.id)}
              onViewResults={() => navigate(`/dashboard?poll=${poll.id}`)}
            />
          ))}
        </div>
      )}

      {deletingId && (
        <p className="sr-only" aria-live="polite">
          Eliminando encuesta...
        </p>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingPoll ? 'Editar encuesta' : 'Nueva encuesta'}</DialogTitle>
            <DialogDescription>
              Define la pregunta y al menos dos opciones de respuesta.
            </DialogDescription>
          </DialogHeader>
          <PollForm
            poll={editingPoll}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </SectionContainer>
  )
}
