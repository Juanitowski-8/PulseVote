import type { User } from '@/types/auth'

const SEED_MOCK_USERS: Array<User & { password: string }> = [
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

export const MOCK_USERS: Array<User & { password: string }> = [...SEED_MOCK_USERS]

export function findMockUserByEmail(email: string) {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function findMockUser(email: string, password: string) {
  return MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  )
}

export function addMockUser(entry: User & { password: string }) {
  MOCK_USERS.push(entry)
  return entry
}
