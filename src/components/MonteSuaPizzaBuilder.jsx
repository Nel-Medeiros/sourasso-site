import { useState, useRef, useEffect } from 'react'
import pizzasData from '../data/pizzas.json'
import bordas from '../data/bordas.json'
import { PIZZA_PRICES, PIZZA_SIZES } from '../data/prices'

const FLAVOR_LIMIT = { 8: 2, 10: 2, 12: 3, 16: 4 }

const BUILDER_SIZES = PIZZA_SIZES.filter((s) => s !== 6)

const CATEGORIES = ['Tradicionais', 'Especiais', 'Premium', 'Doces', 'Doces Especiais']

const CATEGORY_RANK = { Tradicionais: 0, Doces: 1, Especiais: 2, 'Doces Especiais': 3, Premium: 4 }

const ALL_FLAVORS = pizzasData.flatMap((group) =>
  group.items
    .filter((item) => item.isActive)
    .map((item) => ({ ...item, category: group.category }))
)

export default function MonteSuaPizzaBuilder({ onAdd }) {
  const limitTimerRef = useRef(null)
  useEffect(() => () => clearTimeout(limitTimerRef.current), [])

  const [selectedSize, setSelectedSize] = useState(BUILDER_SIZES[0])
  const [selectedBorda, setSelectedBorda] = useState(null)
  const [selectedFlavors, setSelectedFlavors] = useState([])
  const [observations, setObservations] = useState('')
  const [showLimitMessage, setShowLimitMessage] = useState(false)

  const maxFlavors = FLAVOR_LIMIT[selectedSize]

  const effectiveCategory =
    selectedFlavors.length > 0
      ? selectedFlavors.reduce((best, f) =>
          (CATEGORY_RANK[f.category] ?? 0) > (CATEGORY_RANK[best.category] ?? 0) ? f : best
        ).category
      : 'Tradicionais'

  const basePrice = PIZZA_PRICES[effectiveCategory][selectedSize]
  const unitPrice = basePrice + (selectedBorda?.price ?? 0)
  const total = unitPrice.toFixed(2).replace('.', ',')

  const handleSizeChange = (size) => {
    setSelectedSize(size)
    setSelectedFlavors((prev) => prev.slice(0, FLAVOR_LIMIT[size]))
  }

  const handleFlavorToggle = (flavor) => {
    const isSelected = selectedFlavors.some((f) => f.id === flavor.id)
    if (isSelected) {
      setSelectedFlavors((prev) => prev.filter((f) => f.id !== flavor.id))
    } else {
      if (selectedFlavors.length >= maxFlavors) {
        clearTimeout(limitTimerRef.current)
        setShowLimitMessage(true)
        limitTimerRef.current = setTimeout(() => setShowLimitMessage(false), 2000)
        return
      }
      setSelectedFlavors((prev) => [
        ...prev,
        { id: flavor.id, name: flavor.name, category: flavor.category },
      ])
    }
  }

  const handleAdd = () => {
    onAdd({
      productId: 'custom-pizza',
      name: 'Monte sua Pizza',
      category: 'pizza',
      pizzaCategory: effectiveCategory,
      size: { slices: selectedSize, price: basePrice },
      borda: selectedBorda,
      flavors: selectedFlavors,
      observations,
      unitPrice,
      quantity: 1,
    })
    setSelectedSize(BUILDER_SIZES[0])
    setSelectedBorda(null)
    setSelectedFlavors([])
    setObservations('')
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-6">
      {/* Size */}
      <div>
        <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-2">
          Tamanho
        </p>
        <div role="radiogroup" aria-label="Tamanho da pizza" className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {BUILDER_SIZES.map((size) => {
            const price = PIZZA_PRICES[effectiveCategory][size].toFixed(2).replace('.', ',')
            return (
              <button
                key={size}
                role="radio"
                aria-checked={selectedSize === size}
                onClick={() => handleSizeChange(size)}
                className={`flex-shrink-0 flex flex-col items-center p-2 rounded-xl border min-w-[64px] text-xs transition-colors ${
                  selectedSize === size
                    ? 'bg-terracotta text-white border-terracotta'
                    : 'bg-white text-terracotta border-cream'
                }`}
              >
                <span className="font-bold text-sm">{size}</span>
                <span className="opacity-80">fatias</span>
                <span className="font-semibold mt-1">R${price}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Borda */}
      <div>
        <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-2">
          Borda (opcional)
        </p>
        <div role="radiogroup" aria-label="Borda" className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            role="radio"
            aria-checked={selectedBorda === null}
            onClick={() => setSelectedBorda(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors ${
              selectedBorda === null
                ? 'bg-terracotta text-white border-terracotta'
                : 'bg-white text-terracotta border-cream'
            }`}
          >
            Sem borda
          </button>
          {bordas.map((borda) => (
            <button
              key={borda.id}
              role="radio"
              aria-checked={selectedBorda?.id === borda.id}
              onClick={() => setSelectedBorda(borda)}
              className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs border transition-colors ${
                selectedBorda?.id === borda.id
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'bg-white text-terracotta border-cream'
              }`}
            >
              {borda.name} +R${borda.price.toFixed(2).replace('.', ',')}
            </button>
          ))}
        </div>
      </div>

      {/* Flavors */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-terracotta tracking-widest uppercase">
            Sabores (até {maxFlavors})
          </p>
          <span role="status" aria-live="polite" className="text-xs text-rose-gold font-medium">
            {showLimitMessage ? `Limite de ${maxFlavors} sabores atingido` : ''}
          </span>
        </div>
        {CATEGORIES.map((cat) => {
          const flavors = ALL_FLAVORS.filter((f) => f.category === cat)
          if (flavors.length === 0) return null
          return (
            <div key={cat} className="mb-4">
              <p className="text-xs font-bold text-rose-gold mb-2">{cat}</p>
              <div className="flex flex-col gap-1">
                {flavors.map((flavor) => {
                  const isSelected = selectedFlavors.some((f) => f.id === flavor.id)
                  return (
                    <button
                      key={flavor.id}
                      aria-pressed={isSelected}
                      onClick={() => handleFlavorToggle(flavor)}
                      className={`flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
                        isSelected
                          ? 'bg-terracotta/10 border border-terracotta'
                          : 'bg-white border border-transparent'
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          isSelected
                            ? 'bg-terracotta border-terracotta'
                            : 'border-terracotta'
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M2 5l2.5 2.5L8 3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-dark-brown">{flavor.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{flavor.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Observations */}
      <div>
        <label
          htmlFor="pizza-observations"
          className="text-xs font-bold text-terracotta tracking-widest uppercase mb-2 block"
        >
          Observações
        </label>
        <textarea
          id="pizza-observations"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Ex: sem cebola, borda bem assada..."
          rows={2}
          className="w-full border border-cream rounded-lg p-3 text-sm text-dark-brown placeholder-gray-300 resize-none focus:outline-none focus:border-terracotta"
        />
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={selectedFlavors.length === 0}
        className="w-full bg-terracotta text-cream font-bold py-3.5 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Adicionar ao Carrinho — R${total}
      </button>
    </div>
  )
}
