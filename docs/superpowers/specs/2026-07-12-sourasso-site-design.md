# Sourasso Pizzaria — Website Design Spec
**Date:** 2026-07-12  
**Status:** Approved

---

## Overview

A mobile-first ordering website for Sourasso Pizzaria, a Brazilian pizzeria based in Piraquara–PR. Customers browse the menu, configure items, add them to a cart, and send the order as a WhatsApp message. No backend required — fully static.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 (hash-based: `/#/`) |
| Styling | Tailwind CSS v3 |
| State | Zustand (cart store) |
| Deploy target | Any static host (Netlify, Vercel, GitHub Pages) |

---

## Visual Identity

- **Palette**: Cream/beige background (`#F5EDE3`), rose-gold/terracotta accents (`#9B5E42`, `#C17B5A`), dark brown text (`#3D1F0F`)
- **Typography**: Georgia/serif for headings and the logo wordmark; system sans-serif for body/UI text
- **Style**: Elegant, warm, brand-faithful — matches the existing Sourasso menu PDF aesthetic
- **Images**: Placeholder image blocks throughout; real product photos drop in later with no code changes

---

## Project Structure

```
src/
├── data/
│   ├── pizzas.json          # Array of {category, items[]}
│   ├── lanches.json         # Flat array of items
│   ├── porcoes.json
│   ├── bebidas.json
│   └── bordas.json          # Crust upgrades with prices
├── store/
│   └── cartStore.js         # Zustand store: items[], addItem, removeItem, updateQty, clear
├── pages/
│   ├── Home.jsx
│   ├── Cart.jsx
│   └── Contact.jsx
├── components/
│   ├── BottomNav.jsx
│   ├── HeroBanner.jsx
│   ├── CategoryTabs.jsx
│   ├── PizzaSubTabs.jsx
│   ├── ProductCard.jsx
│   ├── ProductSheet.jsx     # Bottom sheet — size + borda + observations
│   ├── CartItem.jsx
│   └── CheckoutForm.jsx
└── App.jsx
```

---

## Data Model

### Product (non-pizza)
```json
{
  "id": "lanche-001",
  "name": "Calabresa Burguer",
  "description": "Pão, hambúrguer artesanal, calabresa, muçarela, alface, tomate e maionese.",
  "price": 19.00,
  "prepTime": 20,
  "observations": "",
  "isActive": true
}
```

### Pizza item
```json
{
  "id": "trad-001",
  "name": "Calabresa",
  "description": "Molho de tomate, muçarela, calabresa e orégano.",
  "prepTime": 30,
  "observations": "",
  "isActive": true
}
```
Pizza prices are derived from a shared price table constant (not stored per-item) keyed by category and slice count:

| Category | 6 fatias | 8 fatias | 10 fatias | 12 fatias | 16 fatias |
|---|---|---|---|---|---|
| Tradicionais | R$39,90 | R$49,90 | R$54,90 | R$59,90 | R$69,90 |
| Especiais | R$44,90 | R$54,90 | R$64,90 | R$69,90 | R$79,90 |
| Premium | R$79,90 | R$89,90 | R$94,90 | R$99,90 | R$105,90 |
| Doces | R$44,90 | R$49,90 | R$54,90 | R$69,90 | R$74,90 |
| Doces Especiais | R$74,90 | R$79,90 | R$89,90 | R$94,90 | R$100,90 |

### Borda (crust upgrade)
```json
{ "id": "borda-001", "name": "Cheddar", "price": 15.00 }
```
Full borda list: Cheddar (R$15), Prestígio (R$15), Dois Amores (R$15), Chocolate Branco (R$15), Chocolate Preto (R$15), Chocolate Preto com Amendoim (R$15), Requeijão Cremoso (R$17), Bacon com Catupiry (R$17), Creme de Avelã (R$17).

### Cart Item (Zustand)
```json
{
  "cartId": "uuid-v4",
  "productId": "trad-001",
  "name": "Calabresa",
  "category": "pizza",
  "pizzaCategory": "Tradicionais",
  "size": { "slices": 8, "price": 49.90 },
  "borda": { "id": "borda-001", "name": "Cheddar", "price": 15.00 },
  "observations": "sem cebola",
  "unitPrice": 64.90,
  "quantity": 1
}
```
Non-pizza cart items omit `size`, `borda`, and `pizzaCategory`.

---

## Pages

### Home (`/#/`)

1. **HeroBanner** — rose-gold gradient, Sourasso wordmark placeholder, tagline, "Ver Cardápio" anchor button scrolling to the menu section
2. **CategoryTabs** (sticky on scroll) — Pizzas · Lanches · Porções · Bebidas; active tab scrolls viewport to that section
3. **PizzaSubTabs** — visible only when Pizzas is active; Tradicionais · Especiais · Premium · Doces · Doces Especiais
4. **ProductCard grid** — 2-column; shows image placeholder, name, truncated description, starting price ("a partir de R$X")
5. Tapping a pizza card opens **ProductSheet** (bottom sheet):
   - Pizza name + description
   - Size selector: horizontal scrollable pill buttons (6/8/10/12/16 fatias), price updates live
   - Borda selector: horizontal scrollable pills including "Sem borda" as default
   - Observations: free-text input
   - "Adicionar ao Carrinho — R$X,XX" sticky button at bottom
6. Tapping a non-pizza card opens a simplified bottom sheet: quantity stepper, observations, fixed price, add button
7. **BottomNav** cart icon shows a badge with total item count when cart is non-empty

### Cart (`/#/cart`)

- List of `CartItem` rows: name + size/borda details, quantity stepper (−/+), unit price, remove (×) button
- Order subtotal
- **CheckoutForm**:
  - Name (text input, required)
  - Address (text input, required)
  - Payment method (segmented control: PIX · Cartão de Débito · Cartão de Crédito)
- "Fazer Pedido via WhatsApp" button (disabled until form is valid):
  - Builds UTF-8 encoded message string
  - Opens `https://wa.me/5541998344768?text=<encoded>`

**WhatsApp message format:**
```
🍕 *Pedido Sourasso*

*Itens:*
- Calabresa (8 fatias) + Cheddar: R$64,90
- Sourasso Burguer: R$40,00

*Total: R$104,90*
*Pagamento: PIX*

*Nome:* João Silva
*Endereço:* Rua das Flores, 123
```

### Contact (`/#/contact`)

- Sourasso logo placeholder + full address with Google Maps deep-link
- Opening hours:
  - Terça–Sexta: 19h–23h
  - Sábado–Domingo: 18h–23h
  - Segunda-feira: Fechado
- WhatsApp button → `https://wa.me/5541998344768`

---

## Business Info

| Field | Value |
|---|---|
| WhatsApp | 5541998344768 |
| Address | R. Apolônia Bruneti Gugelmim, 107 - Vila Juliana, Piraquara - PR, 83306-130 |
| Hours (Ter–Sex) | 19h–23h |
| Hours (Sáb–Dom) | 18h–23h |
| Hours (Seg) | Fechado |
| Payment methods | PIX, Cartão de Débito, Cartão de Crédito |

---

## Menu Scope (v1)

Included: Pizzas Tradicionais, Especiais, Premium, Doces, Doces Especiais · Bordas · Lanches · Porções · Bebidas (não-alcoólicas + com álcool)

Excluded (v2): Salgadinhos para festa, Docinhos para festa

---

## Out of Scope

- User accounts / login
- Admin panel for product management (products toggled via `isActive` in JSON)
- Online payment processing
- Order tracking
- Backend / database
