import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { applyThemeClass, resolveInitialTheme } from '@/lib/theme'
import '@/index.css'

applyThemeClass(resolveInitialTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
