import {
  BarChart3,
  ClipboardList,
  LogOut,
  Vote,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { RoleBadge } from '@/components/auth/RoleBadge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const adminLinks = [
  { to: '/admin/polls', label: 'Encuestas', icon: ClipboardList },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
]

const userLinks = [{ to: '/user/polls', label: 'Votar', icon: Vote }]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }
  const links = user?.role === 'ADMIN' ? adminLinks : userLinks

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-accent/30 bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-accent/30 px-5 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
            <Vote className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">PulseVote</p>
            <p className="text-xs text-sidebar-muted">Encuestas en vivo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-white'
                  : 'text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-accent/30 p-4">
        {user && (
          <div className="mb-3 rounded-lg bg-sidebar-accent/40 px-3 py-3">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-sidebar-muted">{user.email}</p>
            <div className="mt-2">
              <RoleBadge role={user.role} />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
