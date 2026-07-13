import { render, screen, fireEvent } from '@testing-library/react'
import ProductSheet from '../ProductSheet'

const PIZZA = {
  id: 'trad-01',
  name: 'Calabresa',
  description: 'Molho de tomate, muçarela, calabresa e orégano.',
  isActive: true,
}

const LANCHE = {
  id: 'lanche-01',
  name: 'Calabresa Burguer',
  description: 'Pão, hambúrguer artesanal, calabresa, muçarela e maionese.',
  price: 19.00,
  isActive: true,
}

describe('pizza mode', () => {
  test('shows product name and size selector', () => {
    render(<ProductSheet product={PIZZA} pizzaCategory="Tradicionais" onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByText('Calabresa')).toBeInTheDocument()
    expect(screen.getByText('Tamanho')).toBeInTheDocument()
  })

  test('shows borda selector with Sem borda default', () => {
    render(<ProductSheet product={PIZZA} pizzaCategory="Tradicionais" onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByText('Borda (opcional)')).toBeInTheDocument()
    expect(screen.getByText('Sem borda')).toBeInTheDocument()
  })

  test('shows starting price for 6 fatias (R$39,90)', () => {
    render(<ProductSheet product={PIZZA} pizzaCategory="Tradicionais" onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByText(/39,90/)).toBeInTheDocument()
  })

  test('calls onAdd with pizza payload when button clicked', () => {
    const onAdd = vi.fn()
    render(<ProductSheet product={PIZZA} pizzaCategory="Tradicionais" onClose={() => {}} onAdd={onAdd} />)
    fireEvent.click(screen.getByRole('button', { name: /Adicionar ao Carrinho/i }))
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 'trad-01',
        name: 'Calabresa',
        category: 'pizza',
        pizzaCategory: 'Tradicionais',
      })
    )
  })

  test('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<ProductSheet product={PIZZA} pizzaCategory="Tradicionais" onClose={onClose} onAdd={() => {}} />)
    fireEvent.click(screen.getByTestId('sheet-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('non-pizza mode', () => {
  test('hides size and borda selectors', () => {
    render(<ProductSheet product={LANCHE} pizzaCategory={null} onClose={() => {}} onAdd={() => {}} />)
    expect(screen.queryByText('Tamanho')).not.toBeInTheDocument()
    expect(screen.queryByText('Borda (opcional)')).not.toBeInTheDocument()
  })

  test('shows quantity stepper', () => {
    render(<ProductSheet product={LANCHE} pizzaCategory={null} onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByText('Quantidade')).toBeInTheDocument()
  })

  test('shows fixed price (R$19,00)', () => {
    render(<ProductSheet product={LANCHE} pizzaCategory={null} onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByRole('button', { name: /19,00/i })).toBeInTheDocument()
  })
})
