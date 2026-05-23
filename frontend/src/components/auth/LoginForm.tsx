import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

const DEMO_CREDENTIALS = {
  admin: { email: 'admin@pulsevote.app', password: 'Admin123!' },
  user: { email: 'user@pulsevote.app', password: 'User123!' },
} as const

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  error?: string | null
  preset?: 'admin' | 'user'
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function LoginForm({ onSubmit, error, preset }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (preset && DEMO_CREDENTIALS[preset]) {
      const { email: e, password: p } = DEMO_CREDENTIALS[preset]
      setEmail(e)
      setPassword(p)
      setFieldErrors({})
    }
  }, [preset])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) errors.email = 'El email es obligatorio'
    else if (!validateEmail(email)) errors.email = 'Introduce un email válido'
    if (!password) errors.password = 'La contraseña es obligatoria'

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    try {
      await onSubmit(email.trim(), password)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setFieldErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tu@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && (
          <p className="text-xs text-destructive">{fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!fieldErrors.password}
        />
        {fieldErrors.password && (
          <p className="text-xs text-destructive">{fieldErrors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        className="h-10 w-full rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Iniciando sesión...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </Button>

      <div className="rounded-lg border border-border/80 bg-muted/40 p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Cuentas de prueba
        </p>
        <div className="space-y-2 text-sm">
          <button
            type="button"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-left transition hover:border-primary/40 hover:bg-primary/5"
            onClick={() => fillDemo('admin@pulsevote.app', 'Admin123!')}
          >
            <span className="font-medium text-foreground">Admin</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              admin@pulsevote.app · Admin123!
            </span>
          </button>
          <button
            type="button"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-left transition hover:border-primary/40 hover:bg-primary/5"
            onClick={() => fillDemo('user@pulsevote.app', 'User123!')}
          >
            <span className="font-medium text-foreground">Usuario</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              user@pulsevote.app · User123!
            </span>
          </button>
        </div>
      </div>
    </form>
  )
}
