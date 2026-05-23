import { Link, Outlet } from 'react-router-dom'
import { PulseVoteBrand } from '@/components/brand/PulseVoteLogo'
import { AnimatedPremiumBackground } from '@/components/layout/AnimatedPremiumBackground'
import { WelcomeNavbar } from '@/components/layout/WelcomeNavbar'
export function AuthLayout() {
  return (
    <div className="landing-page flex min-h-screen flex-col">
      <AnimatedPremiumBackground />
      <WelcomeNavbar />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-14">
        <div className="mb-8 flex w-full max-w-md flex-col items-center gap-4">
          <PulseVoteBrand logoSize={40} nameClassName="text-xl font-semibold text-pv-main" />
          <Link
            to="/"
            className="text-sm text-pv-muted transition-colors hover:text-pv-main"
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
