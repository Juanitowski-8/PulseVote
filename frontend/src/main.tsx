import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import '@/index.css'

// Evita flash al cargar: aplica tema guardado antes del primer render
try {
  const stored = localStorage.getItem('pulsevote-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = stored === 'dark' || (stored !== 'light' && prefersDark)
  if (isDark) document.documentElement.classList.add('dark')
} catch {
  /* ignore */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
