import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PulseVoteBrand } from '@/components/brand/PulseVoteLogo'
import { EmptyState } from '@/components/states/EmptyState'
import { Button } from '@/components/ui/button'

describe('PulseVoteBrand', () => {
  it('renders PulseVote brand text', () => {
    render(<PulseVoteBrand />)
    expect(screen.getByText('PulseVote')).toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        title="No hay encuestas"
        description="Vuelve más tarde."
      />,
    )

    expect(screen.getByRole('heading', { name: 'No hay encuestas' })).toBeInTheDocument()
    expect(screen.getByText('Vuelve más tarde.')).toBeInTheDocument()
  })
})

describe('Button', () => {
  it('renders label and respects disabled state', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Button disabled onClick={onClick}>
        Enviar
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Enviar' })
    expect(button).toBeDisabled()

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('calls onClick when enabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Confirmar</Button>)

    await user.click(screen.getByRole('button', { name: 'Confirmar' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
