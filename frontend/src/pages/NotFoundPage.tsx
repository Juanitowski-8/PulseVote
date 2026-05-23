import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <FileQuestion className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        La página que buscas no existe o fue movida.
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}
