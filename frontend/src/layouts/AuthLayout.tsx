import { Link, Outlet } from 'react-router-dom'
import { WelcomeNavbar } from '@/components/layout/WelcomeNavbar'

export function AuthLayout() {
  return (
    <div className="landing-page relative flex min-h-screen flex-col">
      <WelcomeNavbar />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-14">
        <div className="mb-6 w-full max-w-md text-center">
          <Link
            to="/"
            className="text-sm text-[#8FA99B] transition-colors hover:text-[#F3FFF8]"
          >
            ← Volver al inicio
          </Link>
        </div>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
