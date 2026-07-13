import { Link } from 'react-router-dom'
import useCartStore from '../store/cartStore'
import CartItem from '../components/CartItem'
import CheckoutForm from '../components/CheckoutForm'

export default function Cart() {
  const { items, removeItem, updateQty } = useCartStore()
  const total = items
    .reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
    .toFixed(2)
    .replace('.', ',')

  if (items.length === 0) {
    return (
      <div className="bg-cream min-h-screen flex flex-col items-center justify-center gap-4 pb-20 px-8 text-center">
        <span className="text-6xl">🛒</span>
        <h2 className="font-brand text-2xl italic text-dark-brown">Carrinho vazio</h2>
        <p className="text-gray-400 text-sm">
          Adicione itens do cardápio para fazer seu pedido.
        </p>
        <Link
          to="/"
          className="bg-terracotta text-cream font-bold px-6 py-3 rounded-xl text-sm"
        >
          Ver Cardápio
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen pb-20">
      <div className="p-4">
        <h1 className="font-brand text-2xl italic text-dark-brown mb-4">Seu Pedido</h1>
        <div className="flex flex-col gap-3 mb-4">
          {items.map((item) => (
            <CartItem
              key={item.cartId}
              item={item}
              onUpdateQty={updateQty}
              onRemove={removeItem}
            />
          ))}
        </div>
        <div className="flex justify-between items-center bg-white rounded-xl p-4 border border-cream">
          <span className="font-bold text-dark-brown">Total</span>
          <span className="font-bold text-terracotta text-xl">R${total}</span>
        </div>
      </div>
      <CheckoutForm items={items} />
    </div>
  )
}
