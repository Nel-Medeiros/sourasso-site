import { buildWhatsAppUrl } from '../whatsapp'

const ITEMS = [
  {
    name: 'Calabresa',
    size: { slices: 8, price: 49.90 },
    borda: { name: 'Cheddar', price: 15.00 },
    observations: '',
    unitPrice: 64.90,
    quantity: 1,
  },
  {
    name: 'Sourasso Burguer',
    size: null,
    borda: null,
    observations: 'sem cebola',
    unitPrice: 40.00,
    quantity: 2,
  },
]

test('returns a wa.me URL for the Sourasso number', () => {
  const url = buildWhatsAppUrl(ITEMS, { name: 'João', address: 'Rua A, 1', payment: 'PIX' })
  expect(url).toMatch(/^https:\/\/wa\.me\/5541998344768\?text=/)
})

test('decoded message includes pizza size and borda', () => {
  const url = buildWhatsAppUrl(ITEMS, { name: 'João', address: 'Rua A, 1', payment: 'PIX' })
  const decoded = decodeURIComponent(url.split('?text=')[1])
  expect(decoded).toContain('Calabresa')
  expect(decoded).toContain('8 fatias')
  expect(decoded).toContain('Cheddar')
})

test('decoded message includes total, name, address and payment', () => {
  const url = buildWhatsAppUrl(ITEMS, { name: 'João Silva', address: 'Rua A, 1', payment: 'PIX' })
  const decoded = decodeURIComponent(url.split('?text=')[1])
  // 64.90 * 1 + 40.00 * 2 = 144.90
  expect(decoded).toContain('144,90')
  expect(decoded).toContain('João Silva')
  expect(decoded).toContain('Rua A, 1')
  expect(decoded).toContain('PIX')
})

test('includes observations when present', () => {
  const url = buildWhatsAppUrl(ITEMS, { name: 'João', address: 'Rua A', payment: 'PIX' })
  const decoded = decodeURIComponent(url.split('?text=')[1])
  expect(decoded).toContain('sem cebola')
})
