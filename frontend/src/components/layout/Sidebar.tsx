import {
  BarChart3,
  ClipboardList,
  LogOut,
  Vote,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { PulseVoteBrand } from '@/components/brand/PulseVoteLogo'
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
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-border px-5 py-5">
        <PulseVoteBrand
          logoSize={32}
          className="gap-2.5"
          nameClassName="text-base font-semibold text-sidebar-foreground"
        />
        <p className="mt-1 pl-[2.75rem] text-xs text-sidebar-muted">Encuestas en vivo</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4" aria-label="App">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-foreground'
                  : 'text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        {user && (
          <div className="mb-3 rounded-lg border border-border bg-sidebar-accent/50 px-3 py-3">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
            <p className="truncate text-xs text-sidebar-muted">{user.email}</p>
            <div className="mt-2">
              <RoleBadge role={user.role} />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
