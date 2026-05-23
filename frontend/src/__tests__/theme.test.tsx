import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach } from 'vitest'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ThemeProvider } from '@/context/ThemeContext'
import { THEME_STORAGE_KEY } from '@/lib/theme'

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(THEME_STORAGE_KEY, 'light')
    document.documentElement.classList.remove('dark')
  })

  it('toggles dark class and persists theme', async () => {
    const user = userEvent.setup()
    renderWithTheme()

    const button = screen.getByRole('button', { name: /cambiar a modo oscuro/i })
    await user.click(button)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(screen.getByRole('button', { name: /cambiar a modo claro/i })).toBeInTheDocument()
  })
})
