import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface OptionField {
  id?: string
  text: string
}

interface PollOptionInputProps {
  options: OptionField[]
  onChange: (options: OptionField[]) => void
  errors?: string[]
}

export function PollOptionInput({ options, onChange, errors }: PollOptionInputProps) {
  const updateOption = (index: number, text: string) => {
    const next = [...options]
    next[index] = { ...next[index], text }
    onChange(next)
  }

  const addOption = () => onChange([...options, { text: '' }])

  const removeOption = (index: number) => {
    if (options.length <= 2) return
    onChange(options.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Opciones de respuesta</p>
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          <Plus className="h-4 w-4" />
          Añadir
        </Button>
      </div>

      {options.map((option, index) => (
        <div key={option.id ?? index} className="flex gap-2">
          <Input
            placeholder={`Opción ${index + 1}`}
            value={option.text}
            onChange={(e) => updateOption(index, e.target.value)}
            aria-invalid={!!errors?.[index]}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeOption(index)}
            disabled={options.length <= 2}
            aria-label={`Eliminar opción ${index + 1}`}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      ))}

      {errors && errors.length > 0 && (
        <p className="text-xs text-destructive">{errors[0]}</p>
      )}
    </div>
  )
}
