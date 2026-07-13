import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from '../BottomNav'
import useCartStore from '../../store/cartStore'

beforeEach(() => useCartStore.setState({ items: [] }))

test('renders Início, Carrinho and Contato links', () => {
  render(<MemoryRouter><BottomNav /></MemoryRouter>)
  expect(screen.getByText('Início')).toBeInTheDocument()
  expect(screen.getByText('Carrinho')).toBeInTheDocument()
  expect(screen.getByText('Contato')).toBeInTheDocument()
})

test('shows item count badge when cart has items', () => {
  useCartStore.setState({ items: [{ cartId: '1', quantity: 2 }, { cartId: '2', quantity: 1 }] })
  render(<MemoryRouter><BottomNav /></MemoryRouter>)
  expect(screen.getByText('3')).toBeInTheDocument()
})

test('hides badge when cart is empty', () => {
  render(<MemoryRouter><BottomNav /></MemoryRouter>)
  expect(screen.queryByText('0')).not.toBeInTheDocument()
})
