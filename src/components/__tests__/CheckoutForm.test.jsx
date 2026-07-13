import { render, screen, fireEvent } from '@testing-library/react'
import CheckoutForm from '../CheckoutForm'
import useCartStore from '../../store/cartStore'

const mockOpen = vi.fn()
vi.stubGlobal('open', mockOpen)

beforeEach(() => {
  useCartStore.setState({ items: [] })
  mockOpen.mockClear()
})

const ITEMS = [
  {
    name: 'Calabresa',
    size: { slices: 8, price: 49.90 },
    borda: null,
    observations: '',
    unitPrice: 49.90,
    quantity: 1,
  },
]

test('submit button is disabled when name or address is empty', () => {
  render(<CheckoutForm items={ITEMS} />)
  expect(screen.getByRole('button', { name: /Fazer Pedido/i })).toBeDisabled()
})

test('submit button enables when both name and address are filled', () => {
  render(<CheckoutForm items={ITEMS} />)
  fireEvent.change(screen.getByPlaceholderText('Seu nome completo'), {
    target: { value: 'João' },
  })
  fireEvent.change(screen.getByPlaceholderText('Rua, número, bairro'), {
    target: { value: 'Rua A, 1' },
  })
  expect(screen.getByRole('button', { name: /Fazer Pedido/i })).not.toBeDisabled()
})

test('clicking submit opens a WhatsApp URL', () => {
  render(<CheckoutForm items={ITEMS} />)
  fireEvent.change(screen.getByPlaceholderText('Seu nome completo'), {
    target: { value: 'João' },
  })
  fireEvent.change(screen.getByPlaceholderText('Rua, número, bairro'), {
    target: { value: 'Rua A, 1' },
  })
  fireEvent.click(screen.getByRole('button', { name: /Fazer Pedido/i }))
  expect(mockOpen).toHaveBeenCalledWith(
    expect.stringMatching(/wa\.me\/5541998344768/),
    '_blank'
  )
})

test('clears the cart after submit', () => {
  useCartStore.setState({ items: [{ cartId: 'x', quantity: 1 }] })
  render(<CheckoutForm items={ITEMS} />)
  fireEvent.change(screen.getByPlaceholderText('Seu nome completo'), {
    target: { value: 'João' },
  })
  fireEvent.change(screen.getByPlaceholderText('Rua, número, bairro'), {
    target: { value: 'Rua A, 1' },
  })
  fireEvent.click(screen.getByRole('button', { name: /Fazer Pedido/i }))
  expect(useCartStore.getState().items).toHaveLength(0)
})
