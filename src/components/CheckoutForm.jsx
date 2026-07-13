import { useState } from 'react'
import { buildWhatsAppUrl } from '../utils/whatsapp'
import useCartStore from '../store/cartStore'

const PAYMENT_METHODS = ['PIX', 'Cartão de Débito', 'Cartão de Crédito']

export default function CheckoutForm({ items }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState('PIX')
  const clear = useCartStore((s) => s.clear)

  const isValid = name.trim().length > 0 && address.trim().length > 0 && items.length > 0

  const handleSubmit = () => {
    const url = buildWhatsAppUrl(items, {
      name: name.trim(),
      address: address.trim(),
      payment,
    })
    clear()
    window.open(url, '_blank')
  }

  return (
    <div className="p-4">
      <h2 className="font-brand text-xl italic text-dark-brown mb-4">Finalizar Pedido</h2>

      <label className="block text-xs font-bold text-terracotta tracking-widest uppercase mb-1">
        Nome
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome completo"
        className="w-full border border-cream rounded-lg p-3 text-sm text-dark-brown mb-4 focus:outline-none focus:border-terracotta"
      />

      <label className="block text-xs font-bold text-terracotta tracking-widest uppercase mb-1">
        Endereço
      </label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Rua, número, bairro"
        className="w-full border border-cream rounded-lg p-3 text-sm text-dark-brown mb-4 focus:outline-none focus:border-terracotta"
      />

      <label className="block text-xs font-bold text-terracotta tracking-widest uppercase mb-2">
        Pagamento
      </label>
      <div className="flex gap-2 mb-6">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => setPayment(method)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
              payment === method
                ? 'bg-terracotta text-cream border-terracotta'
                : 'bg-white text-terracotta border-cream'
            }`}
          >
            {method}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full bg-terracotta text-cream font-bold py-4 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Fazer Pedido via WhatsApp
      </button>
    </div>
  )
}
