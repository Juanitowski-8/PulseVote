import { BrowserRouter } from 'react-router-dom'
import { PremiumLedBackground } from '@/components/layout/PremiumLedBackground'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AppRoutes } from '@/routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <PremiumLedBackground />
        <AuthProvider>
          <div className="relative z-10 min-h-screen">
            <AppRoutes />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
