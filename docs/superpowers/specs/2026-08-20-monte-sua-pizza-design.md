# Monte sua Pizza — Design Spec

**Date:** 2026-08-20
**Status:** Approved

## Overview

Add a "Monte sua Pizza" sub-tab to the pizza section that lets customers assemble a custom pizza by choosing a size, a borda (optional), and one or more flavors drawn from all existing pizza categories. The price is determined by the most expensive flavor category selected.

---

## Size & Flavor Limits

| Size (slices) | Max flavors |
|---|---|
| 6 | 1 |
| 8 | 2 |
| 10 | 2 |
| 12 | 3 |
| 16 | 4 |

---

## Pricing Logic

Price = `PIZZA_PRICES[mostExpensiveCategory][selectedSize]`

"Most expensive category" is determined by comparing `PIZZA_PRICES[category][selectedSize]` for each selected flavor and taking the max. This is evaluated at runtime whenever flavors or size change.

Category prices at each size are already defined in `src/data/prices.js`.

---

## UI Layout — Inline Builder

When the "Monte sua Pizza" sub-tab is active, the product grid is replaced by a scrollable inline builder with these sections, in order:

### 1. Size selector
- Same pill-button row as `ProductSheet`
- Shows price per size, updating in real time as flavors are selected (price changes when the most expensive category changes)
- Default: first size (6 slices)

### 2. Borda selector
- Same scrollable chip row as `ProductSheet`
- "Sem borda" is selected by default
- One borda maximum

### 3. Flavor list
- Grouped by category with a header per group: Tradicionais → Especiais → Premium → Doces → Doces Especiais
- Only `isActive: true` flavors are shown
- Each flavor row shows:
  - Circular checkbox (filled terracotta when selected)
  - Flavor name (bold)
  - Full description (small gray text below name, always visible)
- Selecting a flavor beyond the size limit does nothing and shows an inline message: *"Limite de X sabores atingido"* (shown once, then disappears after 2 seconds)
- Sweet and savory flavors can be mixed freely

### 4. Observations
- Same textarea as `ProductSheet`: placeholder *"Ex: sem cebola, borda bem assada..."*, 2 rows
- Optional, maps to `observations` on the cart item

### 5. Add to cart button (sticky bottom)
- Label: `Adicionar ao Carrinho — R$XX,XX`
- Disabled (grayed out) until at least 1 flavor is selected
- Price = pizza base price + borda price

---

## Components

### New: `src/components/MonteSuaPizzaBuilder.jsx`

Self-contained builder component. Props:
- `onAdd(item)` — called when user taps the add button, receives the cart item

Internal state:
- `selectedSize` — number (default: 6)
- `selectedBorda` — object | null (default: null)
- `selectedFlavors` — array of `{ id, name, category }` (default: [])
- `limitMessage` — boolean (default: false, triggers the limit message)
- `observations` — string (default: '')

Derives from state:
- `maxFlavors` — computed from `selectedSize` using the size→limit table
- `effectiveCategory` — the category with the highest price at `selectedSize` among `selectedFlavors`; falls back to `'Tradicionais'` when no flavors selected (for price display purposes only)
- `basePrice` — `PIZZA_PRICES[effectiveCategory][selectedSize]`
- `unitPrice` — `basePrice + (selectedBorda?.price ?? 0)`

Data source: flattens `pizzas.json` at module level into `ALL_FLAVORS`:
```js
// Each entry: { id, name, description, category, isActive }
const ALL_FLAVORS = pizzasData.flatMap(group =>
  group.items.map(item => ({ ...item, category: group.category }))
)
```

### Modified: `src/components/PizzaSubTabs.jsx`

Add `'Monte sua Pizza'` as the last entry in `SUBCATEGORIES`:
```js
const SUBCATEGORIES = ['Tradicionais', 'Especiais', 'Premium', 'Doces', 'Doces Especiais', 'Monte sua Pizza']
```

### Modified: `src/pages/Home.jsx`

When `activePizzaSub === 'Monte sua Pizza'`, render `<MonteSuaPizzaBuilder onAdd={addItem} />` instead of the product grid. The `PizzaSubTabs` and `CategoryTabs` remain unchanged above it.

```jsx
{activeCategory === 'Pizzas' && activePizzaSub === 'Monte sua Pizza' ? (
  <MonteSuaPizzaBuilder onAdd={addItem} />
) : (
  <div className="grid grid-cols-2 gap-3 p-4">
    {items.map((product) => ( ... ))}
  </div>
)}
```

### Modified: `src/utils/whatsapp.js`

Add a `Sabores:` line when `item.flavors` is present:
```js
const flavorDetail = item.flavors?.length
  ? `\n  Sabores: ${item.flavors.map(f => f.name).join(' / ')}`
  : ''
return `- ${item.name}${detail}: R$${price}${obs}${flavorDetail}`
```

---

## Cart Item Shape

```js
{
  productId: 'custom-pizza',
  name: 'Monte sua Pizza',
  category: 'pizza',
  pizzaCategory: 'Especiais',       // most expensive selected category
  size: { slices: 8, price: 54.90 },
  borda: { id: 'borda-01', name: 'Cheddar', price: 15.00 }, // or null
  flavors: [
    { id: 'trad-05', name: 'Calabresa', category: 'Tradicionais' },
    { id: 'esp-11', name: 'Mexicana',   category: 'Especiais' },
  ],
  observations: '',
  unitPrice: 69.90,
  quantity: 1,
}
```

---

## WhatsApp Format

```
- Monte sua Pizza (8 fatias) + Cheddar: R$69,90
  Sabores: Calabresa / Mexicana
```

The `buildWhatsAppUrl` function already handles `size`, `borda`, and `observations`. Only the `Sabores:` line is new.

---

## Out of Scope

- No photos in the flavor list (name + description only)
- No quantity selector (always 1, consistent with existing pizza ordering)
- No persistence of builder state between sessions
- No analytics on custom pizza composition
