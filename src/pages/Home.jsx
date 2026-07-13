import { useState } from 'react'
import HeroBanner from '../components/HeroBanner'
import CategoryTabs from '../components/CategoryTabs'
import PizzaSubTabs from '../components/PizzaSubTabs'
import ProductCard from '../components/ProductCard'
import ProductSheet from '../components/ProductSheet'
import useCartStore from '../store/cartStore'
import pizzasData from '../data/pizzas.json'
import lanchesData from '../data/lanches.json'
import porcoesData from '../data/porcoes.json'
import bebidasData from '../data/bebidas.json'
import { PIZZA_PRICES } from '../data/prices'

const CATEGORY_EMOJI = {
  Pizzas: '🍕',
  Lanches: '🍔',
  Porções: '🍟',
  Bebidas: '🥤',
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Pizzas')
  const [activePizzaSub, setActivePizzaSub] = useState('Tradicionais')
  const [sheet, setSheet] = useState(null) // { product, pizzaCategory }
  const addItem = useCartStore((s) => s.addItem)

  const items = (() => {
    switch (activeCategory) {
      case 'Pizzas':
        return (
          pizzasData.find((g) => g.category === activePizzaSub)?.items ?? []
        ).filter((i) => i.isActive)
      case 'Lanches':
        return lanchesData.filter((i) => i.isActive)
      case 'Porções':
        return porcoesData.filter((i) => i.isActive)
      case 'Bebidas':
        return bebidasData.filter((i) => i.isActive)
      default:
        return []
    }
  })()

  const getDisplayPrice = (product) => {
    if (activeCategory !== 'Pizzas') {
      return `R$${product.price.toFixed(2).replace('.', ',')}`
    }
    const starting = PIZZA_PRICES[activePizzaSub][6]
    return `a partir de R$${starting.toFixed(2).replace('.', ',')}`
  }

  const handleSelect = (product) => {
    setSheet({
      product,
      pizzaCategory: activeCategory === 'Pizzas' ? activePizzaSub : null,
    })
  }

  return (
    <div className="bg-cream min-h-screen pb-20">
      <HeroBanner />
      <div id="menu">
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        {activeCategory === 'Pizzas' && (
          <PizzaSubTabs active={activePizzaSub} onChange={setActivePizzaSub} />
        )}
        <div className="grid grid-cols-2 gap-3 p-4">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              displayPrice={getDisplayPrice(product)}
              emoji={CATEGORY_EMOJI[activeCategory]}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {sheet && (
        <ProductSheet
          product={sheet.product}
          pizzaCategory={sheet.pizzaCategory}
          onClose={() => setSheet(null)}
          onAdd={addItem}
        />
      )}
    </div>
  )
}
