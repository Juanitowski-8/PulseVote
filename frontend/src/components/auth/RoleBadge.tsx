import { Badge } from '@/components/ui/badge'
import type { Role } from '@/types/auth'

const labels: Record<Role, string> = {
  ADMIN: 'Administrador',
  USER: 'Usuario',
}

export function RoleBadge({ role }: { role: Role }) {
  return (
    <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>
      {labels[role]}
    </Badge>
  )
}
