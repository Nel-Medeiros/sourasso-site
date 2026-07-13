import { render, screen, fireEvent } from '@testing-library/react'
import CartItem from '../CartItem'

const ITEM = {
  cartId: 'cart-1',
  name: 'Calabresa',
  size: { slices: 8, price: 49.90 },
  borda: { id: 'borda-01', name: 'Cheddar', price: 15.00 },
  observations: 'sem cebola',
  unitPrice: 64.90,
  quantity: 1,
}

test('renders name, size, borda details and total price', () => {
  render(<CartItem item={ITEM} onUpdateQty={() => {}} onRemove={() => {}} />)
  expect(screen.getByText('Calabresa')).toBeInTheDocument()
  expect(screen.getByText(/8 fatias/)).toBeInTheDocument()
  expect(screen.getByText(/Cheddar/)).toBeInTheDocument()
  expect(screen.getByText(/64,90/)).toBeInTheDocument()
})

test('renders observations', () => {
  render(<CartItem item={ITEM} onUpdateQty={() => {}} onRemove={() => {}} />)
  expect(screen.getByText(/sem cebola/)).toBeInTheDocument()
})

test('calls onRemove with cartId when × clicked', () => {
  const onRemove = vi.fn()
  render(<CartItem item={ITEM} onUpdateQty={() => {}} onRemove={onRemove} />)
  fireEvent.click(screen.getByText('✕'))
  expect(onRemove).toHaveBeenCalledWith('cart-1')
})

test('calls onUpdateQty with incremented qty when + clicked', () => {
  const onUpdateQty = vi.fn()
  render(<CartItem item={ITEM} onUpdateQty={onUpdateQty} onRemove={() => {}} />)
  fireEvent.click(screen.getByText('+'))
  expect(onUpdateQty).toHaveBeenCalledWith('cart-1', 2)
})

test('calls onUpdateQty with decremented qty when − clicked', () => {
  const onUpdateQty = vi.fn()
  render(<CartItem item={ITEM} onUpdateQty={onUpdateQty} onRemove={() => {}} />)
  fireEvent.click(screen.getByText('−'))
  expect(onUpdateQty).toHaveBeenCalledWith('cart-1', 0)
})
