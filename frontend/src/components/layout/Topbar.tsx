import { Menu } from 'lucide-react'
import { PulseVoteBrand } from '@/components/brand/PulseVoteLogo'
import { RoleBadge } from '@/components/auth/RoleBadge'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'

interface TopbarProps {
  onMenuClick?: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-sm lg:hidden">
      <div className="flex min-w-0 items-center gap-2">
        {onMenuClick && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label="Abrir menú">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <PulseVoteBrand logoSize={28} nameClassName="text-sm font-semibold" />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle className="h-9 w-9 shadow-none" />
        {user && <RoleBadge role={user.role} />}
      </div>
    </header>
  )
}
