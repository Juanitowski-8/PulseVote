import { Moon, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/utils/cn'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const inApp =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/user') ||
    pathname.startsWith('/dashboard')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'fixed bottom-4 z-[100] flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition hover:bg-muted hover:text-foreground',
        inApp ? 'left-4 lg:left-[17.5rem]' : 'left-4',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
      aria-label={theme === 'dark' ? 'Activar modo día' : 'Activar modo nocturno'}
      title={theme === 'dark' ? 'Modo día' : 'Modo nocturno'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </button>
  )
}
