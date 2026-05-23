import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import type { User } from '@/types/auth'

const baseUser: User = {
  id: 'usr_test',
  name: 'Test User',
  email: 'user@pulsevote.app',
  role: 'USER',
}

vi.mock('@/hooks/useAuth')

import { useAuth } from '@/hooks/useAuth'

const mockUseAuth = vi.mocked(useAuth)

function renderWithRouter(initialPath = '/private') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Página de login</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/private" element={<div>Contenido protegido</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      error: null,
      clearError: vi.fn(),
    })

    renderWithRouter()

    expect(screen.getByText('Página de login')).toBeInTheDocument()
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  })

  it('renders child route when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: baseUser,
      token: 'jwt',
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      error: null,
      clearError: vi.fn(),
    })

    renderWithRouter()

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })

  it('shows loading state while session is verified', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      login: vi.fn(),
      logout: vi.fn(),
      error: null,
      clearError: vi.fn(),
    })

    renderWithRouter()

    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument()
  })
})
