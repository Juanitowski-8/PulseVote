export type Role = 'ADMIN' | 'USER'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface AuthSession {
  token: string
  user: User
}
