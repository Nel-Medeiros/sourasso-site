import useCartStore from '../store/cartStore'
import CartItem from '../components/CartItem'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items, updateQty, removeItem } = useCartStore()
  const subtotal = items
    .reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
    .toFixed(2)
    .replace('.', ',')

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 pb-20">
        <span className="text-6xl">🛒</span>
        <p className="text-dark-brown font-semibold text-lg">Carrinho vazio</p>
        <Link
          to="/"
          className="bg-terracotta text-cream font-bold px-6 py-2.5 rounded-xl text-sm"
        >
          Ver Cardápio
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="p-4 pt-6">
        <h1 className="font-brand text-2xl italic text-dark-brown mb-4">Meu Pedido</h1>
        <div className="flex flex-col gap-3 mb-6">
          {items.map((item) => (
            <CartItem
              key={item.cartId}
              item={item}
              onUpdateQty={updateQty}
              onRemove={removeItem}
            />
          ))}
        </div>
        <div className="bg-white rounded-xl p-4 border border-cream flex justify-between items-center mb-4">
          <span className="text-dark-brown font-semibold">Subtotal</span>
          <span className="text-terracotta font-bold text-lg">R${subtotal}</span>
        </div>
      </div>
    </div>
  )
}
