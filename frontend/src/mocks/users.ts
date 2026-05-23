import type { User } from '@/types/auth'

export const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 'usr_admin',
    name: 'Admin PulseVote',
    email: 'admin@pulsevote.app',
    role: 'ADMIN',
    password: 'Admin123!',
  },
  {
    id: 'usr_user',
    name: 'Usuario Demo',
    email: 'user@pulsevote.app',
    role: 'USER',
    password: 'User123!',
  },
]

export function findMockUser(email: string, password: string) {
  return MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  )
}
