# Monte sua Pizza Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Monte sua Pizza" sub-tab that lets customers pick a size, borda, and up to N flavors from all pizza categories, with price driven by the most expensive selected flavor category.

**Architecture:** One new `MonteSuaPizzaBuilder` component renders inline (replacing the product grid) when the sub-tab is active. Three small edits wire it into `PizzaSubTabs`, `Home`, and `whatsapp.js`. All business logic (flavor limits, effective category, price) lives inside `MonteSuaPizzaBuilder`.

**Tech Stack:** React 19, Tailwind CSS (custom tokens: `terracotta`, `rose-gold`, `cream`, `dark-brown`), Vitest + @testing-library/react, `src/data/pizzas.json`, `src/data/bordas.json`, `src/data/prices.js`

---

## File Map

| Action | Path |
|--------|------|
| Create | `src/components/MonteSuaPizzaBuilder.jsx` |
| Create | `src/components/__tests__/MonteSuaPizzaBuilder.test.jsx` |
| Modify | `src/utils/whatsapp.js` |
| Modify | `src/utils/__tests__/whatsapp.test.js` |
| Modify | `src/components/PizzaSubTabs.jsx` |
| Modify | `src/components/__tests__/PizzaSubTabs.test.jsx` |
| Modify | `src/pages/Home.jsx` |

---

### Task 1: Update whatsapp.js to include flavor list for custom pizzas

**Files:**
- Modify: `src/utils/whatsapp.js`
- Modify: `src/utils/__tests__/whatsapp.test.js`

- [ ] **Step 1: Write the failing test**

Open `src/utils/__tests__/whatsapp.test.js` and add this test at the end of the file:

```js
test('includes Sabores line for custom pizzas with flavors', () => {
  const items = [
    {
      name: 'Monte sua Pizza',
      size: { slices: 8, price: 54.90 },
      borda: { name: 'Cheddar', price: 15.00 },
      flavors: [
        { id: 'trad-05', name: 'Calabresa', category: 'Tradicionais' },
        { id: 'esp-11', name: 'Mexicana', category: 'Especiais' },
      ],
      observations: '',
      unitPrice: 69.90,
      quantity: 1,
    },
  ]
  const url = buildWhatsAppUrl(items, { name: 'João', address: 'Rua A', payment: 'PIX' })
  const decoded = decodeURIComponent(url.split('?text=')[1])
  expect(decoded).toContain('Sabores: Calabresa / Mexicana')
})

test('omits Sabores line for regular items without flavors', () => {
  const items = [
    {
      name: 'Calabresa',
      size: { slices: 8, price: 49.90 },
      borda: null,
      observations: '',
      unitPrice: 49.90,
      quantity: 1,
    },
  ]
  const url = buildWhatsAppUrl(items, { name: 'João', address: 'Rua A', payment: 'PIX' })
  const decoded = decodeURIComponent(url.split('?text=')[1])
  expect(decoded).not.toContain('Sabores')
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/utils/__tests__/whatsapp.test.js
```

Expected: FAIL — `Sabores` not found in decoded message

- [ ] **Step 3: Update buildWhatsAppUrl in whatsapp.js**

Replace the `lines` map in `src/utils/whatsapp.js` with:

```js
const lines = items.map((item) => {
  const sizeDetail = item.size ? `(${item.size.slices} fatias)` : ''
  const bordaDetail = item.borda ? ` + ${item.borda.name}` : ''
  const detail = sizeDetail ? ` ${sizeDetail}${bordaDetail}` : ''
  const price = (item.unitPrice * item.quantity).toFixed(2).replace('.', ',')
  const obs = item.observations ? ` _(${item.observations})_` : ''
  const flavorDetail = item.flavors?.length
    ? `\n  Sabores: ${item.flavors.map((f) => f.name).join(' / ')}`
    : ''
  return `- ${item.name}${detail}: R$${price}${obs}${flavorDetail}`
})
```

- [ ] **Step 4: Run all whatsapp tests to verify they pass**

```bash
npx vitest run src/utils/__tests__/whatsapp.test.js
```

Expected: PASS — 6 tests (4 existing + 2 new)

- [ ] **Step 5: Commit**

```bash
git add src/utils/whatsapp.js src/utils/__tests__/whatsapp.test.js
git commit -m "feat: add Sabores line to WhatsApp message for custom pizzas"
```

---

### Task 2: Add 'Monte sua Pizza' to PizzaSubTabs

**Files:**
- Modify: `src/components/PizzaSubTabs.jsx`
- Modify: `src/components/__tests__/PizzaSubTabs.test.jsx`

- [ ] **Step 1: Write the failing test**

In `src/components/__tests__/PizzaSubTabs.test.jsx`, update the existing `'renders all five pizza subcategories'` test and add a click test:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PizzaSubTabs from '../PizzaSubTabs'

describe('PizzaSubTabs', () => {
  it('renders all six pizza subcategories', () => {
    render(<PizzaSubTabs active="Tradicionais" onChange={() => {}} />)
    expect(screen.getByText('Tradicionais')).toBeInTheDocument()
    expect(screen.getByText('Especiais')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('Doces')).toBeInTheDocument()
    expect(screen.getByText('Doces Especiais')).toBeInTheDocument()
    expect(screen.getByText('Monte sua Pizza')).toBeInTheDocument()
  })

  it('calls onChange with subcategory name when clicked', () => {
    const onChange = vi.fn()
    render(<PizzaSubTabs active="Tradicionais" onChange={onChange} />)
    fireEvent.click(screen.getByText('Premium'))
    expect(onChange).toHaveBeenCalledWith('Premium')
  })

  it('calls onChange with "Monte sua Pizza" when clicked', () => {
    const onChange = vi.fn()
    render(<PizzaSubTabs active="Tradicionais" onChange={onChange} />)
    fireEvent.click(screen.getByText('Monte sua Pizza'))
    expect(onChange).toHaveBeenCalledWith('Monte sua Pizza')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/__tests__/PizzaSubTabs.test.jsx
```

Expected: FAIL — `Monte sua Pizza` not found

- [ ] **Step 3: Add 'Monte sua Pizza' to PizzaSubTabs**

In `src/components/PizzaSubTabs.jsx`, update the first line:

```js
const SUBCATEGORIES = ['Tradicionais', 'Especiais', 'Premium', 'Doces', 'Doces Especiais', 'Monte sua Pizza']
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/components/__tests__/PizzaSubTabs.test.jsx
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add src/components/PizzaSubTabs.jsx src/components/__tests__/PizzaSubTabs.test.jsx
git commit -m "feat: add Monte sua Pizza sub-tab to PizzaSubTabs"
```

---

### Task 3: Build MonteSuaPizzaBuilder component

**Files:**
- Create: `src/components/__tests__/MonteSuaPizzaBuilder.test.jsx`
- Create: `src/components/MonteSuaPizzaBuilder.jsx`

Reference files to understand patterns:
- `src/components/ProductSheet.jsx` — size selector and borda selector UI patterns
- `src/data/pizzas.json` — pizza data structure (array of `{ category, items[] }`)
- `src/data/bordas.json` — borda data (`[{ id, name, price }]`)
- `src/data/prices.js` — `PIZZA_PRICES[category][size]` and `PIZZA_SIZES = [6, 8, 10, 12, 16]`

- [ ] **Step 1: Write the failing tests**

Create `src/components/__tests__/MonteSuaPizzaBuilder.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MonteSuaPizzaBuilder from '../MonteSuaPizzaBuilder'

describe('MonteSuaPizzaBuilder', () => {
  it('renders all five size buttons', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('16')).toBeInTheDocument()
  })

  it('add button is disabled when no flavors are selected', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    expect(screen.getByRole('button', { name: /Adicionar ao Carrinho/i })).toBeDisabled()
  })

  it('add button is enabled after selecting a flavor', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    fireEvent.click(screen.getByText('Calabresa'))
    expect(screen.getByRole('button', { name: /Adicionar ao Carrinho/i })).not.toBeDisabled()
  })

  it('calls onAdd with correct cart item shape when adding', () => {
    const onAdd = vi.fn()
    render(<MonteSuaPizzaBuilder onAdd={onAdd} />)
    fireEvent.click(screen.getByText('Calabresa'))
    fireEvent.click(screen.getByRole('button', { name: /Adicionar ao Carrinho/i }))
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 'custom-pizza',
        name: 'Monte sua Pizza',
        category: 'pizza',
        flavors: expect.arrayContaining([
          expect.objectContaining({ name: 'Calabresa' }),
        ]),
        quantity: 1,
      })
    )
  })

  it('shows limit message when trying to select more flavors than the size allows', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    // Default size is 6 (max 1 flavor)
    fireEvent.click(screen.getByText('Calabresa'))
    fireEvent.click(screen.getByText('Margherita'))
    expect(screen.getByText(/Limite de 1 sabores atingido/i)).toBeInTheDocument()
  })

  it('trims selected flavors when size decreases below current flavor count', () => {
    const onAdd = vi.fn()
    render(<MonteSuaPizzaBuilder onAdd={onAdd} />)
    // Switch to 8-slice (allows 2 flavors)
    fireEvent.click(screen.getByText('8'))
    fireEvent.click(screen.getByText('Calabresa'))
    fireEvent.click(screen.getByText('Margherita'))
    // Switch back to 6-slice (max 1 flavor) — should trim to 1
    fireEvent.click(screen.getByText('6'))
    fireEvent.click(screen.getByRole('button', { name: /Adicionar ao Carrinho/i }))
    const item = onAdd.mock.calls[0][0]
    expect(item.flavors).toHaveLength(1)
  })

  it('renders flavor names and descriptions', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    expect(screen.getByText('Calabresa')).toBeInTheDocument()
    // Description from pizzas.json
    expect(screen.getByText(/Molho de tomate, muçarela, calabresa/i)).toBeInTheDocument()
  })

  it('renders category headers', () => {
    render(<MonteSuaPizzaBuilder onAdd={() => {}} />)
    expect(screen.getByText('Tradicionais')).toBeInTheDocument()
    expect(screen.getByText('Especiais')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/components/__tests__/MonteSuaPizzaBuilder.test.jsx
```

Expected: FAIL — `Cannot find module '../MonteSuaPizzaBuilder'`

- [ ] **Step 3: Create MonteSuaPizzaBuilder.jsx**

Create `src/components/MonteSuaPizzaBuilder.jsx`:

```jsx
import { useState } from 'react'
import pizzasData from '../data/pizzas.json'
import bordas from '../data/bordas.json'
import { PIZZA_PRICES, PIZZA_SIZES } from '../data/prices'

const FLAVOR_LIMIT = { 6: 1, 8: 2, 10: 2, 12: 3, 16: 4 }

const CATEGORIES = ['Tradicionais', 'Especiais', 'Premium', 'Doces', 'Doces Especiais']

const ALL_FLAVORS = pizzasData.flatMap((group) =>
  group.items
    .filter((item) => item.isActive)
    .map((item) => ({ ...item, category: group.category }))
)

export default function MonteSuaPizzaBuilder({ onAdd }) {
  const [selectedSize, setSelectedSize] = useState(PIZZA_SIZES[0])
  const [selectedBorda, setSelectedBorda] = useState(null)
  const [selectedFlavors, setSelectedFlavors] = useState([])
  const [observations, setObservations] = useState('')
  const [showLimitMessage, setShowLimitMessage] = useState(false)

  const maxFlavors = FLAVOR_LIMIT[selectedSize]

  const effectiveCategory =
    selectedFlavors.length > 0
      ? selectedFlavors.reduce((best, f) =>
          PIZZA_PRICES[f.category][selectedSize] > PIZZA_PRICES[best.category][selectedSize]
            ? f
            : best
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
        setShowLimitMessage(true)
        setTimeout(() => setShowLimitMessage(false), 2000)
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
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-6">
      {/* Size */}
      <div>
        <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-2">
          Tamanho
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {PIZZA_SIZES.map((size) => {
            const price = PIZZA_PRICES[effectiveCategory][size].toFixed(2).replace('.', ',')
            return (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
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
      </div>

      {/* Borda */}
      <div>
        <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-2">
          Borda (opcional)
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
      </div>

      {/* Flavors */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-terracotta tracking-widest uppercase">
            Sabores (até {maxFlavors})
          </p>
          {showLimitMessage && (
            <span className="text-xs text-rose-gold font-medium">
              Limite de {maxFlavors} sabores atingido
            </span>
          )}
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
        <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-2">
          Observações
        </p>
        <textarea
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/components/__tests__/MonteSuaPizzaBuilder.test.jsx
```

Expected: PASS — 7 tests

- [ ] **Step 5: Commit**

```bash
git add src/components/MonteSuaPizzaBuilder.jsx src/components/__tests__/MonteSuaPizzaBuilder.test.jsx
git commit -m "feat: add MonteSuaPizzaBuilder component"
```

---

### Task 4: Wire MonteSuaPizzaBuilder into Home.jsx

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Add the import**

In `src/pages/Home.jsx`, add this import after the `HeroBanner` import line:

```jsx
import MonteSuaPizzaBuilder from '../components/MonteSuaPizzaBuilder'
```

- [ ] **Step 2: Replace the product grid with conditional render**

In `src/pages/Home.jsx`, find this block:

```jsx
        <div className="grid grid-cols-2 gap-3 p-4">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              displayPrice={getDisplayPrice(product)}
              emoji={CATEGORY_EMOJI[activeCategory]}
              onSelect={handleSelect}
              tallImage={activeCategory === 'Bebidas'}
            />
          ))}
        </div>
```

Replace it with:

```jsx
        {activeCategory === 'Pizzas' && activePizzaSub === 'Monte sua Pizza' ? (
          <MonteSuaPizzaBuilder onAdd={addItem} />
        ) : (
          <div className="grid grid-cols-2 gap-3 p-4">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                displayPrice={getDisplayPrice(product)}
                emoji={CATEGORY_EMOJI[activeCategory]}
                onSelect={handleSelect}
                tallImage={activeCategory === 'Bebidas'}
              />
            ))}
          </div>
        )}
```

- [ ] **Step 3: Run the full test suite**

```bash
npm test -- --run
```

Expected: all unit tests pass (pre-existing Playwright suite errors are unrelated and expected)

- [ ] **Step 4: Verify visually**

Start the dev server (`npm run dev`) and open the app. Navigate to Pizzas → Monte sua Pizza. Confirm:
- Builder renders with size, borda, and flavor sections
- Selecting a flavor enables the add-to-cart button
- Selecting more flavors than the size allows shows the limit message
- Adding a custom pizza lands in the cart
- Switching to any other sub-tab (Tradicionais, Especiais, etc.) shows the normal product grid

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: wire MonteSuaPizzaBuilder into Home page"
```
