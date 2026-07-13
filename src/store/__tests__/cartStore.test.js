import { renderHook, act } from '@testing-library/react'
import useCartStore from '../cartStore'

const ITEM = {
  productId: 'trad-01',
  name: 'Calabresa',
  category: 'pizza',
  pizzaCategory: 'Tradicionais',
  size: { slices: 8, price: 49.90 },
  borda: null,
  observations: '',
  unitPrice: 49.90,
  quantity: 1,
}

beforeEach(() => useCartStore.setState({ items: [] }))

test('starts with empty cart', () => {
  const { result } = renderHook(() => useCartStore())
  expect(result.current.items).toHaveLength(0)
})

test('addItem stores item with a cartId', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(ITEM))
  expect(result.current.items).toHaveLength(1)
  expect(result.current.items[0].cartId).toBeDefined()
  expect(result.current.items[0].name).toBe('Calabresa')
})

test('removeItem deletes by cartId', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(ITEM))
  const id = result.current.items[0].cartId
  act(() => result.current.removeItem(id))
  expect(result.current.items).toHaveLength(0)
})

test('updateQty changes quantity', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(ITEM))
  const id = result.current.items[0].cartId
  act(() => result.current.updateQty(id, 3))
  expect(result.current.items[0].quantity).toBe(3)
})

test('updateQty with 0 removes item', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(ITEM))
  const id = result.current.items[0].cartId
  act(() => result.current.updateQty(id, 0))
  expect(result.current.items).toHaveLength(0)
})

test('clear empties the cart', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(ITEM))
  act(() => result.current.clear())
  expect(result.current.items).toHaveLength(0)
})
