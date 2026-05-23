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
        'fixed bottom-4 z-[100] flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-all duration-300',
        inApp ? 'left-4 lg:left-[17.5rem]' : 'left-4',
        'border-border bg-card text-foreground hover:scale-105 hover:shadow-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'dark:border-white/20 dark:bg-black dark:text-emerald-300 dark:hover:bg-white/10',
      )}
      aria-label={theme === 'dark' ? 'Activar modo día' : 'Activar modo nocturno'}
      title={theme === 'dark' ? 'Modo día' : 'Modo nocturno'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400" aria-hidden />
      ) : (
        <Moon className="h-5 w-5 text-primary" aria-hidden />
      )}
    </button>
  )
}
