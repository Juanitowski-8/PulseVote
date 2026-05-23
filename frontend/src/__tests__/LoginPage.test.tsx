import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoginPage } from '@/pages/LoginPage'

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    error: null,
    clearError: vi.fn(),
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    logout: vi.fn(),
  }),
}))

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  it('renders login heading, email, password and submit button', () => {
    renderLoginPage()

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('shows demo account hints for PulseVote seed users', () => {
    renderLoginPage()

    expect(screen.getAllByText(/admin@pulsevote\.app/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/user@pulsevote\.app/i).length).toBeGreaterThan(0)
  })
})
