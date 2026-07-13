import { useState } from 'react'
import { PIZZA_PRICES, PIZZA_SIZES } from '../data/prices'
import bordas from '../data/bordas.json'

export default function ProductSheet({ product, pizzaCategory, onClose, onAdd }) {
  const isPizza = Boolean(pizzaCategory)
  const [selectedSize, setSelectedSize] = useState(PIZZA_SIZES[0])
  const [selectedBorda, setSelectedBorda] = useState(null)
  const [observations, setObservations] = useState('')
  const [quantity, setQuantity] = useState(1)

  const pizzaBasePrice = isPizza ? PIZZA_PRICES[pizzaCategory][selectedSize] : 0
  const bordaPrice = selectedBorda?.price ?? 0
  const unitPrice = isPizza ? pizzaBasePrice + bordaPrice : product.price
  const total = (unitPrice * quantity).toFixed(2).replace('.', ',')

  const handleAdd = () => {
    const item = isPizza
      ? {
          productId: product.id,
          name: product.name,
          category: 'pizza',
          pizzaCategory,
          size: { slices: selectedSize, price: pizzaBasePrice },
          borda: selectedBorda,
          observations,
          unitPrice,
          quantity: 1,
        }
      : {
          productId: product.id,
          name: product.name,
          category: 'other',
          size: null,
          borda: null,
          observations,
          unitPrice: product.price,
          quantity,
        }
    onAdd(item)
    onClose()
  }

  return (
    <>
      <div
        data-testid="sheet-backdrop"
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="p-4 pb-8">
          <h2 className="font-brand text-xl italic text-dark-brown mb-1">{product.name}</h2>
          <p className="text-gray-400 text-sm mb-4">{product.description}</p>

          {isPizza && (
            <>
              <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-2">
                Tamanho
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {PIZZA_SIZES.map((size) => {
                  const price = PIZZA_PRICES[pizzaCategory][size].toFixed(2).replace('.', ',')
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-shrink-0 flex flex-col items-center p-2 rounded-xl border min-w-[64px] text-xs transition-colors ${
                        selectedSize === size
                          ? 'bg-terracotta text-white border-terracotta'
                          : 'bg-cream text-terracotta border-cream'
                      }`}
                    >
                      <span className="font-bold text-sm">{size}</span>
                      <span className="opacity-80">fatias</span>
                      <span className="font-semibold mt-1">R${price}</span>
                    </button>
                  )
                })}
              </div>

              <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-2">
                Borda (opcional)
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                <button
                  onClick={() => setSelectedBorda(null)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    selectedBorda === null
                      ? 'bg-terracotta text-white border-terracotta'
                      : 'bg-cream text-terracotta border-cream'
                  }`}
                >
                  Sem borda
                </button>
                {bordas.map((borda) => (
                  <button
                    key={borda.id}
                    onClick={() => setSelectedBorda(borda)}
                    className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      selectedBorda?.id === borda.id
                        ? 'bg-terracotta text-white border-terracotta'
                        : 'bg-cream text-terracotta border-cream'
                    }`}
                  >
                    {borda.name} +R${borda.price.toFixed(2).replace('.', ',')}
                  </button>
                ))}
              </div>
            </>
          )}

          {!isPizza && (
            <div className="flex items-center gap-4 mb-4">
              <p className="text-xs font-bold text-terracotta tracking-widest uppercase">
                Quantidade
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-cream text-terracotta font-bold text-lg flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-dark-brown font-semibold w-5 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full bg-terracotta text-white font-bold text-lg flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-2">
            Observações
          </p>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Ex: sem cebola, borda bem assada..."
            rows={2}
            className="w-full border border-cream rounded-lg p-3 text-sm text-dark-brown placeholder-gray-300 mb-4 resize-none focus:outline-none focus:border-terracotta"
          />

          <button
            onClick={handleAdd}
            className="w-full bg-terracotta text-cream font-bold py-3.5 rounded-xl text-sm"
          >
            Adicionar ao Carrinho — R${total}
          </button>
        </div>
      </div>
    </>
  )
}
