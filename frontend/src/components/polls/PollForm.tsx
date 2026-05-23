import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PollOptionInput, type OptionField } from '@/components/polls/PollOptionInput'
import type { Poll, PollFormData } from '@/types/poll'

interface PollFormProps {
  poll?: Poll
  onSubmit: (data: PollFormData) => Promise<void>
  onCancel: () => void
}

function validateForm(question: string, options: OptionField[]) {
  const errors: Record<string, string> = {}
  if (!question.trim()) errors.question = 'La pregunta es obligatoria'
  if (options.length < 2) errors.options = 'Debe haber al menos 2 opciones'
  const empty = options.some((o) => !o.text.trim())
  if (empty) errors.options = 'Las opciones no pueden estar vacías'
  return errors
}

export function PollForm({ poll, onSubmit, onCancel }: PollFormProps) {
  const [question, setQuestion] = useState(poll?.question ?? '')
  const [isActive, setIsActive] = useState(poll?.isActive ?? true)
  const [options, setOptions] = useState<OptionField[]>(
    poll?.options.map((o) => ({ id: o.id, text: o.text })) ?? [{ text: '' }, { text: '' }],
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (poll) {
      setQuestion(poll.question)
      setIsActive(poll.isActive)
      setOptions(poll.options.map((o) => ({ id: o.id, text: o.text })))
    }
  }, [poll])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateForm(question, options)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        question: question.trim(),
        isActive,
        options: options.map((o) => ({ id: o.id, text: o.text.trim() })),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="question">Pregunta</Label>
        <Input
          id="question"
          placeholder="¿Cuál es tu pregunta?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {errors.question && (
          <p className="text-xs text-destructive">{errors.question}</p>
        )}
      </div>

      <PollOptionInput
        options={options}
        onChange={setOptions}
        errors={errors.options ? [errors.options] : undefined}
      />

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
        />
        <div>
          <p className="text-sm font-medium">Encuesta activa</p>
          <p className="text-xs text-muted-foreground">
            Solo las encuestas activas son visibles para usuarios.
          </p>
        </div>
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : poll ? 'Guardar cambios' : 'Crear encuesta'}
        </Button>
      </div>
    </form>
  )
}
