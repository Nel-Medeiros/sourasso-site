import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MonteSuaPizzaBuilder from '../MonteSuaPizzaBuilder'

describe('MonteSuaPizzaBuilder', () => {
  it('renders all five size buttons', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('16')).toBeInTheDocument()
  })

  it('add button is disabled when no flavors are selected', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    expect(screen.getByRole('button', { name: /Adicionar ao Carrinho/i })).toBeDisabled()
  })

  it('add button is enabled after selecting a flavor', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    fireEvent.click(screen.getByText('Calabresa'))
    expect(screen.getByRole('button', { name: /Adicionar ao Carrinho/i })).not.toBeDisabled()
  })

  it('calls onAdd with correct cart item shape when adding', () => {
    const onAdd = vi.fn()
    render(<MonteSuaPizzaBuilder onAdd={onAdd} />)
    fireEvent.click(screen.getByText('Calabresa'))
    fireEvent.click(screen.getByRole('button', { name: /Adicionar ao Carrinho/i }))
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 'custom-pizza',
        name: 'Monte sua Pizza',
        category: 'pizza',
        flavors: expect.arrayContaining([
          expect.objectContaining({ name: 'Calabresa' }),
        ]),
        quantity: 1,
      })
    )
  })

  it('shows limit message when trying to select more flavors than the size allows', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    // Default size is 6 (max 1 flavor)
    fireEvent.click(screen.getByText('Calabresa'))
    fireEvent.click(screen.getByText('Margherita'))
    expect(screen.getByText(/Limite de 1 sabores atingido/i)).toBeInTheDocument()
  })

  it('trims selected flavors when size decreases below current flavor count', () => {
    const onAdd = vi.fn()
    render(<MonteSuaPizzaBuilder onAdd={onAdd} />)
    // Switch to 8-slice (allows 2 flavors)
    fireEvent.click(screen.getByText('8'))
    fireEvent.click(screen.getByText('Calabresa'))
    fireEvent.click(screen.getByText('Margherita'))
    // Switch back to 6-slice (max 1 flavor) — should trim to 1
    fireEvent.click(screen.getByText('6'))
    fireEvent.click(screen.getByRole('button', { name: /Adicionar ao Carrinho/i }))
    const item = onAdd.mock.calls[0][0]
    expect(item.flavors).toHaveLength(1)
  })

  it('renders flavor names and descriptions', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    expect(screen.getByText('Calabresa')).toBeInTheDocument()
    expect(screen.getAllByText(/Molho de tomate, muçarela, calabresa/i)[0]).toBeInTheDocument()
  })

  it('renders category headers', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    expect(screen.getByText('Tradicionais')).toBeInTheDocument()
    expect(screen.getByText('Especiais')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })
})
