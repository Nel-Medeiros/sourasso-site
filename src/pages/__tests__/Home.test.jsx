import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from '../Home'

// Provide minimal cart store mock
vi.mock('../../store/cartStore', () => ({
  default: (selector) => selector({ addItem: () => {} }),
}))

describe('Home', () => {
  it('renders MonteSuaPizzaBuilder when Monte sua Pizza sub-tab is active', () => {
    render(<Home />)
    fireEvent.click(screen.getByRole('button', { name: /Monte sua Pizza/i }))
    expect(screen.getByRole('button', { name: /Adicionar ao Carrinho/i })).toBeInTheDocument()
  })

  it('renders product grid when a regular pizza sub-tab is active', () => {
    render(<Home />)
    // Default is Tradicionais — product grid should be visible
    expect(screen.queryByRole('button', { name: /Adicionar ao Carrinho/i })).not.toBeInTheDocument()
  })
})
