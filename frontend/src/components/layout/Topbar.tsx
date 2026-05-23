import { Menu, Vote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RoleBadge } from '@/components/auth/RoleBadge'
import { useAuth } from '@/hooks/useAuth'

interface TopbarProps {
  onMenuClick?: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-2">
        {onMenuClick && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label="Abrir menú">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Vote className="h-5 w-5 text-primary" />
        <span className="font-bold text-foreground">PulseVote</span>
      </div>
      {user && <RoleBadge role={user.role} />}
    </header>
  )
}
