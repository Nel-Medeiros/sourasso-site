import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MonteSuaPizzaBuilder from '../MonteSuaPizzaBuilder'

describe('MonteSuaPizzaBuilder', () => {
  it('renders four size buttons (6 slices excluded)', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    const sizeGroup = screen.getByRole('radiogroup', { name: /Tamanho/i })
    const buttons = within(sizeGroup).getAllByRole('radio')
    expect(buttons).toHaveLength(4)
    expect(within(sizeGroup).queryByText('6')).not.toBeInTheDocument()
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
    const item = onAdd.mock.calls[0][0]
    expect(item).toMatchObject({
      productId: 'custom-pizza',
      name: 'Monte sua Pizza',
      category: 'pizza',
      pizzaCategory: 'Tradicionais',
      size: { slices: 8, price: 49.90 },
      borda: null,
      quantity: 1,
      unitPrice: 49.90,
    })
    expect(item.flavors).toHaveLength(1)
    expect(item.flavors[0].name).toBe('Calabresa')
  })

  it('shows limit message when trying to select more flavors than the size allows', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    // Default size is 8 (max 2 flavors)
    fireEvent.click(screen.getByText('Calabresa'))
    fireEvent.click(screen.getByText('Margherita'))
    fireEvent.click(screen.getByText('Frango com Catupiry'))
    expect(screen.getByRole('status')).toHaveTextContent(/Limite de 2 sabores atingido/i)
  })

  it('trims selected flavors when size decreases below current flavor count', () => {
    const onAdd = vi.fn()
    render(<MonteSuaPizzaBuilder onAdd={onAdd} />)
    const sizeGroup = screen.getByRole('radiogroup', { name: /Tamanho/i })
    const sizeRadios = within(sizeGroup).getAllByRole('radio') // [8, 10, 12, 16]
    // Switch to 12-slice (allows 3 flavors)
    fireEvent.click(sizeRadios[2])
    fireEvent.click(screen.getByText('Calabresa'))
    fireEvent.click(screen.getByText('Margherita'))
    fireEvent.click(screen.getByText('Frango com Catupiry'))
    // Switch back to 8-slice (max 2 flavors) — should trim to 2
    fireEvent.click(sizeRadios[0])
    fireEvent.click(screen.getByRole('button', { name: /Adicionar ao Carrinho/i }))
    const item = onAdd.mock.calls[0][0]
    expect(item.flavors).toHaveLength(2)
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

  it('price updates to most expensive category when a Premium flavor is selected', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    // Default size is 8; Tradicionais price = R$49,90
    expect(screen.getByRole('button', { name: /Adicionar ao Carrinho.*49,90/i })).toBeInTheDocument()
    // Select a Premium flavor — "Costela com Polenguinho" is Premium
    fireEvent.click(screen.getByText('Costela com Polenguinho'))
    // Premium price for size 8 = R$89,90
    expect(screen.getByRole('button', { name: /Adicionar ao Carrinho.*89,90/i })).toBeInTheDocument()
  })
})
