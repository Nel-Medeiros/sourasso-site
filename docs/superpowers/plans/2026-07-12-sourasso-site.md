# Sourasso Pizzaria Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first React + Vite ordering website for Sourasso Pizzaria where customers browse a menu, configure items (pizza size + crust), and send orders via WhatsApp.

**Architecture:** Three hash-routed pages (Home, Cart, Contact) in a static SPA. Product data lives in JSON files. Zustand manages cart state. Checkout builds a WhatsApp `wa.me` URL with the formatted order.

**Tech Stack:** React 18, Vite, React Router v6 (hash), Tailwind CSS v3, Zustand, Vitest, React Testing Library

---

## File Map

```
src/
├── data/
│   ├── pizzas.json
│   ├── lanches.json
│   ├── porcoes.json
│   ├── bebidas.json
│   ├── bordas.json
│   └── prices.js
├── store/
│   ├── cartStore.js
│   └── __tests__/cartStore.test.js
├── utils/
│   ├── whatsapp.js
│   └── __tests__/whatsapp.test.js
├── components/
│   ├── BottomNav.jsx
│   ├── HeroBanner.jsx
│   ├── CategoryTabs.jsx
│   ├── PizzaSubTabs.jsx
│   ├── ProductCard.jsx
│   ├── ProductSheet.jsx
│   ├── CartItem.jsx
│   ├── CheckoutForm.jsx
│   └── __tests__/
│       ├── BottomNav.test.jsx
│       ├── CategoryTabs.test.jsx
│       ├── PizzaSubTabs.test.jsx
│       ├── ProductCard.test.jsx
│       ├── ProductSheet.test.jsx
│       ├── CartItem.test.jsx
│       └── CheckoutForm.test.jsx
├── pages/
│   ├── Home.jsx
│   ├── Cart.jsx
│   └── Contact.jsx
├── test/
│   └── setup.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## Task 1: Scaffold project

**Files:**
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `src/test/setup.js`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Create Vite + React project in the current directory**

```bash
cd "H:/Sourasso/Site"
npm create vite@latest . -- --template react
```

When prompted about non-empty directory, choose "Ignore files and continue".

- [ ] **Step 2: Install all dependencies**

```bash
npm install
npm install react-router-dom zustand
npm install -D tailwindcss postcss autoprefixer @tailwindcss/line-clamp
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npx tailwindcss init -p
```

- [ ] **Step 3: Replace `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

- [ ] **Step 4: Replace `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5EDE3',
        'rose-gold': '#C17B5A',
        terracotta: '#9B5E42',
        'dark-brown': '#3D1F0F',
      },
      fontFamily: {
        brand: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Create `src/test/setup.js`**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Replace `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cream font-sans text-dark-brown;
  }
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 7: Add test script to `package.json`**

In the `"scripts"` section, add:
```json
"test": "vitest",
"test:ui": "vitest --ui"
```

- [ ] **Step 8: Delete Vite boilerplate files**

```bash
rm src/App.css src/assets/react.svg public/vite.svg
```

- [ ] **Step 9: Run tests to confirm setup works**

```bash
npx vitest run
```

Expected: "No test files found" (no error — setup is valid).

- [ ] **Step 10: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold React + Vite + Tailwind + Zustand + Vitest"
```

---

## Task 2: Data layer — JSON files and price table

**Files:**
- Create: `src/data/pizzas.json`
- Create: `src/data/lanches.json`
- Create: `src/data/porcoes.json`
- Create: `src/data/bebidas.json`
- Create: `src/data/bordas.json`
- Create: `src/data/prices.js`

- [ ] **Step 1: Create `src/data/prices.js`**

```js
export const PIZZA_PRICES = {
  Tradicionais:      { 6: 39.90, 8: 49.90, 10: 54.90, 12: 59.90, 16: 69.90 },
  Especiais:         { 6: 44.90, 8: 54.90, 10: 64.90, 12: 69.90, 16: 79.90 },
  Premium:           { 6: 79.90, 8: 89.90, 10: 94.90, 12: 99.90, 16: 105.90 },
  Doces:             { 6: 44.90, 8: 49.90, 10: 54.90, 12: 69.90, 16: 74.90 },
  'Doces Especiais': { 6: 74.90, 8: 79.90, 10: 89.90, 12: 94.90, 16: 100.90 },
}

export const PIZZA_SIZES = [6, 8, 10, 12, 16]
```

- [ ] **Step 2: Create `src/data/bordas.json`**

```json
[
  { "id": "borda-01", "name": "Cheddar", "price": 15.00 },
  { "id": "borda-02", "name": "Prestígio", "price": 15.00 },
  { "id": "borda-03", "name": "Dois Amores", "price": 15.00 },
  { "id": "borda-04", "name": "Chocolate Branco", "price": 15.00 },
  { "id": "borda-05", "name": "Chocolate Preto", "price": 15.00 },
  { "id": "borda-06", "name": "Chocolate Preto com Amendoim", "price": 15.00 },
  { "id": "borda-07", "name": "Requeijão Cremoso", "price": 17.00 },
  { "id": "borda-08", "name": "Bacon com Catupiry", "price": 17.00 },
  { "id": "borda-09", "name": "Creme de Avelã", "price": 17.00 }
]
```

- [ ] **Step 3: Create `src/data/pizzas.json`**

```json
[
  {
    "category": "Tradicionais",
    "items": [
      { "id": "trad-01", "name": "Muçarela", "description": "Molho de tomate, muçarela, molho de tomate e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-02", "name": "Alho e Óleo", "description": "Molho de tomate, muçarela, molho de alho, óleo, tomate e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-03", "name": "Brasileira", "description": "Molho de tomate, muçarela, presunto, catupiry, azeitona e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-04", "name": "Carijó", "description": "Molho de tomate, muçarela, frango, milho, ovos e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-05", "name": "Calabresa", "description": "Molho de tomate, muçarela, calabresa e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-06", "name": "Calabresa com Cebola", "description": "Molho de tomate, muçarela, calabresa, cebola e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-07", "name": "Calabresa Alho e Óleo", "description": "Molho de tomate, muçarela, calabresa, alho frito, óleo e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-08", "name": "Crocante", "description": "Molho de tomate, muçarela, bacon, batata palha e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-09", "name": "Frango com Catupiry", "description": "Molho de tomate, muçarela, frango, catupiry e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-10", "name": "Milho com Bacon", "description": "Molho de tomate, muçarela, bacon, milho e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-11", "name": "Napolitano", "description": "Molho de tomate, muçarela, parmesão, tomate e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-12", "name": "Palmito", "description": "Molho de tomate, muçarela, palmito, catupiry, azeitona e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-13", "name": "Portuguesa", "description": "Molho de tomate, muçarela, presunto, cebola, ovos, pimentão, azeitona e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-14", "name": "Quatro Queijos", "description": "Molho de tomate, muçarela, parmesão, provolone, catupiry e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-15", "name": "Frango com Cheddar", "description": "Molho de tomate, muçarela, frango, cheddar e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-16", "name": "Catubresa", "description": "Molho de tomate, muçarela, calabresa, catupiry e orégano.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "trad-17", "name": "Margherita", "description": "Molho de tomate, muçarela, parmesão, tomate e manjericão fresco.", "prepTime": 30, "observations": "", "isActive": true }
    ]
  },
  {
    "category": "Especiais",
    "items": [
      { "id": "esp-01", "name": "Batata Frita", "description": "Molho de tomate, muçarela, batata frita, bacon e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-02", "name": "Batata Frita com Cheddar", "description": "Molho de tomate, muçarela, batata frita, bacon, cheddar e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-03", "name": "Bolonhesa", "description": "Molho de tomate, muçarela, carne à bolonhesa, parmesão e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-04", "name": "Carioca", "description": "Molho de tomate, muçarela, champignon, palmito, azeitona e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-05", "name": "Calabresa Especial", "description": "Molho de tomate, muçarela, calabresa, bacon, ovos e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-06", "name": "Canadense", "description": "Molho de tomate, muçarela, parmesão, lombo, champignon e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-07", "name": "Cinco Queijos", "description": "Molho de tomate, muçarela, parmesão, provolone, catupiry, cheddar e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-08", "name": "Lombo à Califórnia", "description": "Molho de tomate, muçarela, lombo, abacaxi e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-09", "name": "Lombo com Catupiry", "description": "Molho de tomate, muçarela, lombo, catupiry e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-10", "name": "Lombo com Cheddar", "description": "Molho de tomate, muçarela, lombo, cheddar e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-11", "name": "Mexicana", "description": "Molho de tomate, muçarela, calabresa, pimentão, cebola, pimenta calabresa e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-12", "name": "Mandioca com Bacon", "description": "Molho de tomate, muçarela, mandioca frita, bacon e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-13", "name": "Margherita Especial", "description": "Molho de tomate, muçarela, tomate cereja, queijo polenguinho, manjericão fresco e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-14", "name": "Paulista", "description": "Molho de tomate, muçarela, milho, ervilha, palmito, bacon e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-15", "name": "Strogonoff de Carne", "description": "Molho de tomate, muçarela, strogonoff de carne, batata palha e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-16", "name": "Strogonoff de Frango", "description": "Molho de tomate, muçarela, strogonoff de frango, batata palha e orégano.", "prepTime": 35, "observations": "", "isActive": true },
      { "id": "esp-17", "name": "Sourasso", "description": "Molho de tomate, muçarela, parmesão, palmito, bacon, champignon, calabresa, milho, cebola e orégano.", "prepTime": 35, "observations": "", "isActive": true }
    ]
  },
  {
    "category": "Premium",
    "items": [
      { "id": "prem-01", "name": "Costela com Polenguinho", "description": "Molho de tomate, muçarela, costela desfiada, queijo polenguinho e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-02", "name": "Costela Cremosa", "description": "Molho de tomate, muçarela, costela desfiada, requeijão cremoso, azeitona preta e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-03", "name": "Costela com Molho Barbecue", "description": "Molho de tomate, muçarela, costela desfiada, molho barbecue e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-04", "name": "Doritos", "description": "Molho de tomate, muçarela, carne moída, bacon, cheddar, doritos e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-05", "name": "Doritos com Mignon", "description": "Molho de tomate, muçarela, tiras de filé mignon, cheddar, doritos e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-06", "name": "Filé Mignon Cremoso", "description": "Molho de tomate, muçarela, tiras de filé mignon, requeijão cremoso e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-07", "name": "Filé Mignon Acebolado", "description": "Molho de tomate, muçarela, tiras de filé mignon, cebola roxa e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-08", "name": "Frango com Requeijão Cremoso", "description": "Molho de tomate, muçarela, frango, requeijão cremoso e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-09", "name": "Alcatra Acebolada", "description": "Molho de tomate, muçarela, parmesão, alcatra, cebola roxa e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-10", "name": "Pepperoni", "description": "Molho de tomate, muçarela, pepperoni, azeitona preta e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-11", "name": "Pepperoni com Cream Cheese", "description": "Molho de tomate, muçarela, pepperoni, cream cheese e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-12", "name": "Bacon com Alho-Poró", "description": "Molho de tomate, muçarela, bacon em cubos, alho-poró, cream cheese e orégano.", "prepTime": 40, "observations": "", "isActive": true },
      { "id": "prem-13", "name": "Alho-Poró com Cream Cheese", "description": "Molho de tomate, muçarela, alho-poró, cream cheese e orégano.", "prepTime": 40, "observations": "", "isActive": true }
    ]
  },
  {
    "category": "Doces",
    "items": [
      { "id": "doce-01", "name": "Prestígio", "description": "Muçarela, chocolate preto e coco ralado.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-02", "name": "Abacaxi", "description": "Muçarela, abacaxi e chocolate branco.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-03", "name": "Banana Nevada", "description": "Muçarela, banana e chocolate branco.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-04", "name": "Banoffee", "description": "Muçarela, banana, canela e doce de leite.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-05", "name": "Brigadeiro", "description": "Muçarela, chocolate preto e granulado.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-06", "name": "Confete", "description": "Muçarela, chocolate preto e confete.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-07", "name": "Doce Pecado", "description": "Muçarela, chocolate preto, morango e leite condensado.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-08", "name": "Dois Amores", "description": "Muçarela, chocolate preto e chocolate branco.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-09", "name": "Ouro Branco", "description": "Muçarela, chocolate branco e ouro branco.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-10", "name": "Sonho de Valsa", "description": "Muçarela, chocolate preto, morango e sonho de valsa.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-11", "name": "Surpresa de Uva", "description": "Muçarela, chocolate preto, chocolate branco e uvas verdes sem sementes.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-12", "name": "Bombom de Uva", "description": "Muçarela, chocolate preto, uvas verdes sem sementes e leite ninho.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-13", "name": "Sensação", "description": "Muçarela, chocolate preto, morango e granulado.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-14", "name": "Morango com Suspiro", "description": "Muçarela, morango, suspiro e creme de avelã.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-15", "name": "Sourasso Doce", "description": "Muçarela, creme de avelã, morango e banana.", "prepTime": 30, "observations": "", "isActive": true }
    ]
  },
  {
    "category": "Doces Especiais",
    "items": [
      { "id": "doce-esp-01", "name": "Rafaello", "description": "Muçarela, chocolate branco, coco ralado, morango e rafaello.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-esp-02", "name": "Kinder Bueno", "description": "Muçarela, chocolate branco, chocolate preto, kinder bueno e morango.", "prepTime": 30, "observations": "", "isActive": true },
      { "id": "doce-esp-03", "name": "Ferrero Rocher", "description": "Muçarela, creme de avelã, morango, amendoim e ferrero rocher.", "prepTime": 30, "observations": "", "isActive": true }
    ]
  }
]
```

- [ ] **Step 4: Create `src/data/lanches.json`**

```json
[
  { "id": "lanche-01", "name": "Calabresa Burguer", "description": "Pão, hambúrguer artesanal, calabresa, muçarela, alface, tomate em rodelas e maionese.", "price": 19.00, "prepTime": 20, "observations": "", "isActive": true },
  { "id": "lanche-02", "name": "Ovo Burguer", "description": "Pão, hambúrguer artesanal, ovo, muçarela, presunto, alface, tomate em rodelas e maionese.", "price": 19.00, "prepTime": 20, "observations": "", "isActive": true },
  { "id": "lanche-03", "name": "Frango Burguer", "description": "Pão, filé de frango, muçarela, alface, tomate em rodelas e maionese.", "price": 30.00, "prepTime": 20, "observations": "", "isActive": true },
  { "id": "lanche-04", "name": "Cheddar Burguer", "description": "Pão, hambúrguer artesanal, cheddar, alface, tomate em rodelas e maionese.", "price": 24.00, "prepTime": 20, "observations": "", "isActive": true },
  { "id": "lanche-05", "name": "Kids Burguer", "description": "Pão, hambúrguer artesanal, muçarela e maionese.", "price": 15.00, "prepTime": 15, "observations": "", "isActive": true },
  { "id": "lanche-06", "name": "Tradicional Burguer", "description": "Pão, hambúrguer artesanal, muçarela, presunto, alface, tomate em rodelas e maionese.", "price": 19.00, "prepTime": 20, "observations": "", "isActive": true },
  { "id": "lanche-07", "name": "Bacon Burguer", "description": "Pão, hambúrguer artesanal, muçarela, bacon em fatia, alface, picles e maionese.", "price": 27.00, "prepTime": 20, "observations": "", "isActive": true },
  { "id": "lanche-08", "name": "Cheddar Bacon Burguer", "description": "Pão, hambúrguer artesanal, cheddar, bacon fatia, alface, picles e maionese.", "price": 30.00, "prepTime": 20, "observations": "", "isActive": true },
  { "id": "lanche-09", "name": "Roxa Burguer", "description": "Pão, hambúrguer artesanal, muçarela, picles, cebola roxa, alface, tomate e maionese.", "price": 25.00, "prepTime": 20, "observations": "", "isActive": true },
  { "id": "lanche-10", "name": "Doritos Burguer", "description": "Pão, hambúrguer artesanal, cheddar, doritos, bacon em fatia, alface e maionese.", "price": 37.00, "prepTime": 25, "observations": "", "isActive": true },
  { "id": "lanche-11", "name": "Duplo Burguer", "description": "Pão, 2 hambúrgueres artesanais, cheddar, picles, alface, tomate em rodelas e maionese.", "price": 37.00, "prepTime": 25, "observations": "", "isActive": true },
  { "id": "lanche-12", "name": "Sourasso Burguer", "description": "Pão, hambúrguer artesanal, ovo, muçarela, presunto, bacon em fatia, frango desfiado, alface, tomate em rodelas, cebola e maionese.", "price": 40.00, "prepTime": 25, "observations": "", "isActive": true }
]
```

- [ ] **Step 5: Create `src/data/porcoes.json`**

```json
[
  { "id": "porcao-01", "name": "Batata Frita", "description": "500g · 2 a 3 pessoas · com cheiro verde.", "price": 27.00, "prepTime": 15, "observations": "", "isActive": true },
  { "id": "porcao-02", "name": "Batata Frita com Bacon", "description": "500g · 2 a 3 pessoas · com cheiro verde.", "price": 30.00, "prepTime": 15, "observations": "", "isActive": true },
  { "id": "porcao-03", "name": "Batata Frita com Muçarela e Bacon", "description": "500g · 2 a 3 pessoas · com cheiro verde.", "price": 33.00, "prepTime": 15, "observations": "", "isActive": true },
  { "id": "porcao-04", "name": "Batata Frita com Cheddar e Bacon", "description": "500g · 2 a 3 pessoas · com cheiro verde.", "price": 36.00, "prepTime": 15, "observations": "", "isActive": true },
  { "id": "porcao-05", "name": "Calabresa", "description": "500g · 2 a 3 pessoas · com cheiro verde.", "price": 26.00, "prepTime": 15, "observations": "", "isActive": true },
  { "id": "porcao-06", "name": "Calabresa com Cebola", "description": "500g · 2 a 3 pessoas · com cheiro verde.", "price": 28.00, "prepTime": 15, "observations": "", "isActive": true },
  { "id": "porcao-07", "name": "Frango à Passarinho", "description": "500g · 2 a 3 pessoas · com cheiro verde.", "price": 30.00, "prepTime": 20, "observations": "", "isActive": true },
  { "id": "porcao-08", "name": "Mandioca Frita", "description": "500g · 2 a 3 pessoas · com cheiro verde.", "price": 26.00, "prepTime": 15, "observations": "", "isActive": true },
  { "id": "porcao-09", "name": "Mandioca Frita com Bacon", "description": "500g · 2 a 3 pessoas · com cheiro verde.", "price": 30.00, "prepTime": 15, "observations": "", "isActive": true },
  { "id": "porcao-10", "name": "Polenta Frita", "description": "500g · 2 a 3 pessoas · com cheiro verde.", "price": 26.00, "prepTime": 15, "observations": "", "isActive": true },
  { "id": "porcao-11", "name": "Polenta Frita com Bacon", "description": "500g · 2 a 3 pessoas · com cheiro verde.", "price": 30.00, "prepTime": 15, "observations": "", "isActive": true }
]
```

- [ ] **Step 6: Create `src/data/bebidas.json`**

```json
[
  { "id": "beb-01", "name": "Água sem Gás", "description": "500ml.", "price": 3.00, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-02", "name": "Água com Gás", "description": "500ml.", "price": 3.50, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-03", "name": "Coca Cola", "description": "2 litros.", "price": 15.00, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-04", "name": "Coca Cola Zero", "description": "2 litros.", "price": 16.00, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-05", "name": "Guaraná Antártica", "description": "2 litros.", "price": 13.50, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-06", "name": "Fanta Laranja", "description": "2 litros.", "price": 13.50, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-07", "name": "Sprite", "description": "2 litros.", "price": 13.50, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-08", "name": "Cini Abacaxi", "description": "2 litros.", "price": 10.00, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-09", "name": "Cini Framboesa", "description": "2 litros.", "price": 10.00, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-10", "name": "Suco de Abacaxi", "description": "785ml — jarra.", "price": 15.00, "prepTime": 5, "observations": "", "isActive": true },
  { "id": "beb-11", "name": "Suco de Abacaxi com Hortelã", "description": "785ml — jarra.", "price": 17.00, "prepTime": 5, "observations": "", "isActive": true },
  { "id": "beb-12", "name": "Suco de Laranja", "description": "785ml — jarra.", "price": 15.00, "prepTime": 5, "observations": "", "isActive": true },
  { "id": "beb-13", "name": "Suco de Abacaxi", "description": "500ml — garrafa (delivery).", "price": 10.00, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-14", "name": "Suco de Abacaxi", "description": "1 litro — garrafa (delivery).", "price": 20.00, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-15", "name": "Suco de Abacaxi com Hortelã", "description": "500ml — garrafa (delivery).", "price": 12.00, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-16", "name": "Suco de Abacaxi com Hortelã", "description": "1 litro — garrafa (delivery).", "price": 24.00, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-17", "name": "Suco de Laranja", "description": "500ml — garrafa (delivery).", "price": 10.00, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-18", "name": "Suco de Laranja", "description": "1 litro — garrafa (delivery).", "price": 20.00, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-alc-01", "name": "Corona Long Neck", "description": "330ml.", "price": 9.90, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-alc-02", "name": "Heineken Long Neck", "description": "330ml.", "price": 8.90, "prepTime": 0, "observations": "", "isActive": true },
  { "id": "beb-alc-03", "name": "Heineken Zero Long Neck", "description": "330ml.", "price": 8.90, "prepTime": 0, "observations": "", "isActive": true }
]
```

- [ ] **Step 7: Commit**

```bash
git add src/data/
git commit -m "feat: add all product JSON data and pizza price table"
```

---

## Task 3: Cart store and WhatsApp utility

**Files:**
- Create: `src/store/cartStore.js`
- Create: `src/store/__tests__/cartStore.test.js`
- Create: `src/utils/whatsapp.js`
- Create: `src/utils/__tests__/whatsapp.test.js`

- [ ] **Step 1: Write the cart store tests**

```js
// src/store/__tests__/cartStore.test.js
import { renderHook, act } from '@testing-library/react'
import useCartStore from '../cartStore'

const ITEM = {
  productId: 'trad-01',
  name: 'Calabresa',
  category: 'pizza',
  pizzaCategory: 'Tradicionais',
  size: { slices: 8, price: 49.90 },
  borda: null,
  observations: '',
  unitPrice: 49.90,
  quantity: 1,
}

beforeEach(() => useCartStore.setState({ items: [] }))

test('starts with empty cart', () => {
  const { result } = renderHook(() => useCartStore())
  expect(result.current.items).toHaveLength(0)
})

test('addItem stores item with a cartId', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(ITEM))
  expect(result.current.items).toHaveLength(1)
  expect(result.current.items[0].cartId).toBeDefined()
  expect(result.current.items[0].name).toBe('Calabresa')
})

test('removeItem deletes by cartId', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(ITEM))
  const id = result.current.items[0].cartId
  act(() => result.current.removeItem(id))
  expect(result.current.items).toHaveLength(0)
})

test('updateQty changes quantity', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(ITEM))
  const id = result.current.items[0].cartId
  act(() => result.current.updateQty(id, 3))
  expect(result.current.items[0].quantity).toBe(3)
})

test('updateQty with 0 removes item', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(ITEM))
  const id = result.current.items[0].cartId
  act(() => result.current.updateQty(id, 0))
  expect(result.current.items).toHaveLength(0)
})

test('clear empties the cart', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(ITEM))
  act(() => result.current.clear())
  expect(result.current.items).toHaveLength(0)
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npx vitest run src/store/__tests__/cartStore.test.js
```

Expected: FAIL — `Cannot find module '../cartStore'`

- [ ] **Step 3: Implement `src/store/cartStore.js`**

```js
import { create } from 'zustand'

const useCartStore = create((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, { ...item, cartId: crypto.randomUUID() }],
    })),

  removeItem: (cartId) =>
    set((state) => ({
      items: state.items.filter((i) => i.cartId !== cartId),
    })),

  updateQty: (cartId, qty) =>
    set((state) => ({
      items:
        qty <= 0
          ? state.items.filter((i) => i.cartId !== cartId)
          : state.items.map((i) =>
              i.cartId === cartId ? { ...i, quantity: qty } : i
            ),
    })),

  clear: () => set({ items: [] }),
}))

export default useCartStore
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npx vitest run src/store/__tests__/cartStore.test.js
```

Expected: 6 passed

- [ ] **Step 5: Write WhatsApp utility tests**

```js
// src/utils/__tests__/whatsapp.test.js
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
```

- [ ] **Step 6: Run tests — expect failure**

```bash
npx vitest run src/utils/__tests__/whatsapp.test.js
```

Expected: FAIL — `Cannot find module '../whatsapp'`

- [ ] **Step 7: Implement `src/utils/whatsapp.js`**

```js
const WHATSAPP_NUMBER = '5541998344768'

export function buildWhatsAppUrl(items, { name, address, payment }) {
  const lines = items.map((item) => {
    const sizeDetail = item.size ? `(${item.size.slices} fatias)` : ''
    const bordaDetail = item.borda ? ` + ${item.borda.name}` : ''
    const detail = sizeDetail ? ` ${sizeDetail}${bordaDetail}` : ''
    const price = (item.unitPrice * item.quantity).toFixed(2).replace('.', ',')
    const obs = item.observations ? ` _(${item.observations})_` : ''
    return `- ${item.name}${detail}: R$${price}${obs}`
  })

  const total = items
    .reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
    .toFixed(2)
    .replace('.', ',')

  const message = [
    '🍕 *Pedido Sourasso*',
    '',
    '*Itens:*',
    ...lines,
    '',
    `*Total: R$${total}*`,
    `*Pagamento: ${payment}*`,
    '',
    `*Nome:* ${name}`,
    `*Endereço:* ${address}`,
  ].join('\n')

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
```

- [ ] **Step 8: Run all tests — expect pass**

```bash
npx vitest run
```

Expected: 10 passed

- [ ] **Step 9: Commit**

```bash
git add src/store/ src/utils/
git commit -m "feat: add cart store and WhatsApp message builder"
```

---

## Task 4: App shell and routing

**Files:**
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/pages/Home.jsx` (stub)
- Create: `src/pages/Cart.jsx` (stub)
- Create: `src/pages/Contact.jsx` (stub)

- [ ] **Step 1: Create `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 2: Create page stubs**

`src/pages/Home.jsx`:
```jsx
export default function Home() {
  return <div data-testid="page-home">Home</div>
}
```

`src/pages/Cart.jsx`:
```jsx
export default function Cart() {
  return <div data-testid="page-cart">Cart</div>
}
```

`src/pages/Contact.jsx`:
```jsx
export default function Contact() {
  return <div data-testid="page-contact">Contact</div>
}
```

- [ ] **Step 3: Write App routing test**

```jsx
// src/__tests__/App.test.jsx
import { render, screen } from '@testing-library/react'
import App from '../App'

test('renders Home page at root route', () => {
  window.location.hash = '#/'
  render(<App />)
  expect(screen.getByTestId('page-home')).toBeInTheDocument()
})
```

- [ ] **Step 4: Run test — expect failure**

```bash
npx vitest run src/__tests__/App.test.jsx
```

Expected: FAIL — `Cannot find module '../App'`

- [ ] **Step 5: Create `src/App.jsx`**

```jsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Contact from './pages/Contact'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </HashRouter>
  )
}
```

- [ ] **Step 6: Run test — expect pass**

```bash
npx vitest run src/__tests__/App.test.jsx
```

Expected: 1 passed

- [ ] **Step 7: Commit**

```bash
git add src/main.jsx src/App.jsx src/pages/ src/__tests__/
git commit -m "feat: add app shell with hash routing and page stubs"
```

---

## Task 5: BottomNav component

**Files:**
- Create: `src/components/BottomNav.jsx`
- Create: `src/components/__tests__/BottomNav.test.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write tests**

```jsx
// src/components/__tests__/BottomNav.test.jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from '../BottomNav'
import useCartStore from '../../store/cartStore'

beforeEach(() => useCartStore.setState({ items: [] }))

test('renders Início, Carrinho and Contato links', () => {
  render(<MemoryRouter><BottomNav /></MemoryRouter>)
  expect(screen.getByText('Início')).toBeInTheDocument()
  expect(screen.getByText('Carrinho')).toBeInTheDocument()
  expect(screen.getByText('Contato')).toBeInTheDocument()
})

test('shows item count badge when cart has items', () => {
  useCartStore.setState({ items: [{ cartId: '1', quantity: 2 }, { cartId: '2', quantity: 1 }] })
  render(<MemoryRouter><BottomNav /></MemoryRouter>)
  expect(screen.getByText('3')).toBeInTheDocument()
})

test('hides badge when cart is empty', () => {
  render(<MemoryRouter><BottomNav /></MemoryRouter>)
  expect(screen.queryByText('0')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npx vitest run src/components/__tests__/BottomNav.test.jsx
```

Expected: FAIL — `Cannot find module '../BottomNav'`

- [ ] **Step 3: Create `src/components/BottomNav.jsx`**

```jsx
import { NavLink } from 'react-router-dom'
import useCartStore from '../store/cartStore'

export default function BottomNav() {
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  )

  const link = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 text-xs px-4 py-2 ${
      isActive ? 'text-terracotta' : 'text-gray-400'
    }`

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream flex justify-around items-center h-16 z-50 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <NavLink to="/" end className={link}>
        <span className="text-xl">🏠</span>
        Início
      </NavLink>

      <NavLink to="/cart" className={link}>
        <span className="text-xl relative">
          🛒
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-terracotta text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {itemCount}
            </span>
          )}
        </span>
        Carrinho
      </NavLink>

      <NavLink to="/contact" className={link}>
        <span className="text-xl">📞</span>
        Contato
      </NavLink>
    </nav>
  )
}
```

- [ ] **Step 4: Add BottomNav to `src/App.jsx`**

```jsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import BottomNav from './components/BottomNav'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <BottomNav />
    </HashRouter>
  )
}
```

- [ ] **Step 5: Run all tests — expect pass**

```bash
npx vitest run
```

Expected: all pass

- [ ] **Step 6: Commit**

```bash
git add src/components/BottomNav.jsx src/components/__tests__/BottomNav.test.jsx src/App.jsx
git commit -m "feat: add BottomNav with cart badge"
```

---

## Task 6: HeroBanner, CategoryTabs, PizzaSubTabs

**Files:**
- Create: `src/components/HeroBanner.jsx`
- Create: `src/components/CategoryTabs.jsx`
- Create: `src/components/PizzaSubTabs.jsx`
- Create: `src/components/__tests__/CategoryTabs.test.jsx`
- Create: `src/components/__tests__/PizzaSubTabs.test.jsx`

- [ ] **Step 1: Create `src/components/HeroBanner.jsx`**

```jsx
export default function HeroBanner() {
  return (
    <div className="bg-gradient-to-br from-terracotta to-rose-gold p-8 text-center relative overflow-hidden">
      <p className="text-cream text-xs tracking-widest uppercase mb-1 opacity-80">
        Bem-vindo à
      </p>
      <h1 className="font-brand text-5xl italic text-white mb-1 drop-shadow">
        Sourasso
      </h1>
      <p className="text-cream text-sm opacity-90 mb-5">Pizzaria Artesanal</p>
      <a
        href="#menu"
        className="inline-block bg-cream text-terracotta font-bold text-sm px-6 py-2.5 rounded-lg shadow"
      >
        Ver Cardápio
      </a>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white opacity-10 rounded-full pointer-events-none" />
    </div>
  )
}
```

- [ ] **Step 2: Write CategoryTabs tests**

```jsx
// src/components/__tests__/CategoryTabs.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import CategoryTabs from '../CategoryTabs'

test('renders all four category labels', () => {
  render(<CategoryTabs active="Pizzas" onChange={() => {}} />)
  expect(screen.getByText('Pizzas')).toBeInTheDocument()
  expect(screen.getByText('Lanches')).toBeInTheDocument()
  expect(screen.getByText('Porções')).toBeInTheDocument()
  expect(screen.getByText('Bebidas')).toBeInTheDocument()
})

test('calls onChange with the category name when clicked', () => {
  const onChange = vi.fn()
  render(<CategoryTabs active="Pizzas" onChange={onChange} />)
  fireEvent.click(screen.getByText('Lanches'))
  expect(onChange).toHaveBeenCalledWith('Lanches')
})
```

- [ ] **Step 3: Run CategoryTabs tests — expect failure**

```bash
npx vitest run src/components/__tests__/CategoryTabs.test.jsx
```

Expected: FAIL

- [ ] **Step 4: Create `src/components/CategoryTabs.jsx`**

```jsx
const CATEGORIES = ['Pizzas', 'Lanches', 'Porções', 'Bebidas']

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto py-3 px-4 bg-cream sticky top-0 z-40 scrollbar-hide border-b border-[#EAD9CA]">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
            active === cat
              ? 'bg-terracotta text-cream'
              : 'bg-white text-terracotta border border-terracotta'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Write PizzaSubTabs tests**

```jsx
// src/components/__tests__/PizzaSubTabs.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import PizzaSubTabs from '../PizzaSubTabs'

test('renders all five pizza subcategories', () => {
  render(<PizzaSubTabs active="Tradicionais" onChange={() => {}} />)
  expect(screen.getByText('Tradicionais')).toBeInTheDocument()
  expect(screen.getByText('Especiais')).toBeInTheDocument()
  expect(screen.getByText('Premium')).toBeInTheDocument()
  expect(screen.getByText('Doces')).toBeInTheDocument()
  expect(screen.getByText('Doces Especiais')).toBeInTheDocument()
})

test('calls onChange with subcategory name when clicked', () => {
  const onChange = vi.fn()
  render(<PizzaSubTabs active="Tradicionais" onChange={onChange} />)
  fireEvent.click(screen.getByText('Premium'))
  expect(onChange).toHaveBeenCalledWith('Premium')
})
```

- [ ] **Step 6: Run PizzaSubTabs tests — expect failure**

```bash
npx vitest run src/components/__tests__/PizzaSubTabs.test.jsx
```

Expected: FAIL

- [ ] **Step 7: Create `src/components/PizzaSubTabs.jsx`**

```jsx
const SUBCATEGORIES = ['Tradicionais', 'Especiais', 'Premium', 'Doces', 'Doces Especiais']

export default function PizzaSubTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-4 bg-white border-b border-cream scrollbar-hide">
      {SUBCATEGORIES.map((sub) => (
        <button
          key={sub}
          onClick={() => onChange(sub)}
          className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
            active === sub
              ? 'bg-rose-gold text-white'
              : 'text-terracotta'
          }`}
        >
          {sub}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 8: Run all tests — expect pass**

```bash
npx vitest run
```

Expected: all pass

- [ ] **Step 9: Commit**

```bash
git add src/components/HeroBanner.jsx src/components/CategoryTabs.jsx src/components/PizzaSubTabs.jsx src/components/__tests__/
git commit -m "feat: add HeroBanner, CategoryTabs and PizzaSubTabs"
```

---

## Task 7: ProductCard

**Files:**
- Create: `src/components/ProductCard.jsx`
- Create: `src/components/__tests__/ProductCard.test.jsx`

- [ ] **Step 1: Write tests**

```jsx
// src/components/__tests__/ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../ProductCard'

const PRODUCT = {
  id: 'trad-01',
  name: 'Calabresa',
  description: 'Molho de tomate, muçarela, calabresa e orégano.',
  isActive: true,
}

test('renders name and display price', () => {
  render(<ProductCard product={PRODUCT} displayPrice="a partir de R$39,90" emoji="🍕" onSelect={() => {}} />)
  expect(screen.getByText('Calabresa')).toBeInTheDocument()
  expect(screen.getByText('a partir de R$39,90')).toBeInTheDocument()
})

test('renders truncated description', () => {
  render(<ProductCard product={PRODUCT} displayPrice="a partir de R$39,90" emoji="🍕" onSelect={() => {}} />)
  expect(screen.getByText(/molho de tomate/i)).toBeInTheDocument()
})

test('calls onSelect with the product when clicked', () => {
  const onSelect = vi.fn()
  render(<ProductCard product={PRODUCT} displayPrice="a partir de R$39,90" emoji="🍕" onSelect={onSelect} />)
  fireEvent.click(screen.getByText('Calabresa'))
  expect(onSelect).toHaveBeenCalledWith(PRODUCT)
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npx vitest run src/components/__tests__/ProductCard.test.jsx
```

Expected: FAIL

- [ ] **Step 3: Create `src/components/ProductCard.jsx`**

```jsx
export default function ProductCard({ product, displayPrice, emoji = '🍽️', onSelect }) {
  return (
    <div
      className="bg-white rounded-xl border border-cream p-3 cursor-pointer active:scale-95 transition-transform"
      onClick={() => onSelect(product)}
    >
      <div className="w-full h-24 bg-cream rounded-lg mb-2 flex items-center justify-center">
        <span className="text-4xl">{emoji}</span>
      </div>
      <h3 className="text-dark-brown font-semibold text-sm leading-tight mb-1">
        {product.name}
      </h3>
      <p className="text-gray-400 text-xs line-clamp-2 mb-2">{product.description}</p>
      <p className="text-terracotta text-xs font-semibold">{displayPrice}</p>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npx vitest run src/components/__tests__/ProductCard.test.jsx
```

Expected: 3 passed

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductCard.jsx src/components/__tests__/ProductCard.test.jsx
git commit -m "feat: add ProductCard component"
```

---

## Task 8: ProductSheet (bottom sheet)

**Files:**
- Create: `src/components/ProductSheet.jsx`
- Create: `src/components/__tests__/ProductSheet.test.jsx`

- [ ] **Step 1: Write tests**

```jsx
// src/components/__tests__/ProductSheet.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import ProductSheet from '../ProductSheet'

const PIZZA = {
  id: 'trad-01',
  name: 'Calabresa',
  description: 'Molho de tomate, muçarela, calabresa e orégano.',
  isActive: true,
}

const LANCHE = {
  id: 'lanche-01',
  name: 'Calabresa Burguer',
  description: 'Pão, hambúrguer artesanal, calabresa, muçarela e maionese.',
  price: 19.00,
  isActive: true,
}

describe('pizza mode', () => {
  test('shows product name and size selector', () => {
    render(<ProductSheet product={PIZZA} pizzaCategory="Tradicionais" onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByText('Calabresa')).toBeInTheDocument()
    expect(screen.getByText('Tamanho')).toBeInTheDocument()
  })

  test('shows borda selector with Sem borda default', () => {
    render(<ProductSheet product={PIZZA} pizzaCategory="Tradicionais" onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByText('Borda (opcional)')).toBeInTheDocument()
    expect(screen.getByText('Sem borda')).toBeInTheDocument()
  })

  test('shows starting price for 6 fatias (R$39,90)', () => {
    render(<ProductSheet product={PIZZA} pizzaCategory="Tradicionais" onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByText(/39,90/)).toBeInTheDocument()
  })

  test('calls onAdd with pizza payload when button clicked', () => {
    const onAdd = vi.fn()
    render(<ProductSheet product={PIZZA} pizzaCategory="Tradicionais" onClose={() => {}} onAdd={onAdd} />)
    fireEvent.click(screen.getByRole('button', { name: /Adicionar ao Carrinho/i }))
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 'trad-01',
        name: 'Calabresa',
        category: 'pizza',
        pizzaCategory: 'Tradicionais',
      })
    )
  })

  test('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<ProductSheet product={PIZZA} pizzaCategory="Tradicionais" onClose={onClose} onAdd={() => {}} />)
    fireEvent.click(screen.getByTestId('sheet-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('non-pizza mode', () => {
  test('hides size and borda selectors', () => {
    render(<ProductSheet product={LANCHE} pizzaCategory={null} onClose={() => {}} onAdd={() => {}} />)
    expect(screen.queryByText('Tamanho')).not.toBeInTheDocument()
    expect(screen.queryByText('Borda (opcional)')).not.toBeInTheDocument()
  })

  test('shows quantity stepper', () => {
    render(<ProductSheet product={LANCHE} pizzaCategory={null} onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByText('Quantidade')).toBeInTheDocument()
  })

  test('shows fixed price (R$19,00)', () => {
    render(<ProductSheet product={LANCHE} pizzaCategory={null} onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByRole('button', { name: /19,00/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npx vitest run src/components/__tests__/ProductSheet.test.jsx
```

Expected: FAIL

- [ ] **Step 3: Create `src/components/ProductSheet.jsx`**

```jsx
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
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npx vitest run src/components/__tests__/ProductSheet.test.jsx
```

Expected: 8 passed

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductSheet.jsx src/components/__tests__/ProductSheet.test.jsx
git commit -m "feat: add ProductSheet bottom sheet with pizza size/borda and non-pizza quantity"
```

---

## Task 9: Home page

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Replace `src/pages/Home.jsx` with full implementation**

```jsx
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
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Open http://localhost:5173 — confirm:
- Hero banner renders with rose-gold gradient
- Category tabs are visible and clickable
- Pizza subcategory tabs appear only when Pizzas is active
- Product cards render in a 2-column grid
- Tapping a card opens the bottom sheet
- Adding a pizza to cart shows the badge in BottomNav

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: implement Home page with menu, category tabs and bottom sheet"
```

---

## Task 10: CartItem and Cart page

**Files:**
- Create: `src/components/CartItem.jsx`
- Create: `src/components/__tests__/CartItem.test.jsx`
- Modify: `src/pages/Cart.jsx`

- [ ] **Step 1: Write CartItem tests**

```jsx
// src/components/__tests__/CartItem.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import CartItem from '../CartItem'

const ITEM = {
  cartId: 'cart-1',
  name: 'Calabresa',
  size: { slices: 8, price: 49.90 },
  borda: { id: 'borda-01', name: 'Cheddar', price: 15.00 },
  observations: 'sem cebola',
  unitPrice: 64.90,
  quantity: 1,
}

test('renders name, size, borda details and total price', () => {
  render(<CartItem item={ITEM} onUpdateQty={() => {}} onRemove={() => {}} />)
  expect(screen.getByText('Calabresa')).toBeInTheDocument()
  expect(screen.getByText(/8 fatias/)).toBeInTheDocument()
  expect(screen.getByText(/Cheddar/)).toBeInTheDocument()
  expect(screen.getByText(/64,90/)).toBeInTheDocument()
})

test('renders observations', () => {
  render(<CartItem item={ITEM} onUpdateQty={() => {}} onRemove={() => {}} />)
  expect(screen.getByText(/sem cebola/)).toBeInTheDocument()
})

test('calls onRemove with cartId when × clicked', () => {
  const onRemove = vi.fn()
  render(<CartItem item={ITEM} onUpdateQty={() => {}} onRemove={onRemove} />)
  fireEvent.click(screen.getByText('✕'))
  expect(onRemove).toHaveBeenCalledWith('cart-1')
})

test('calls onUpdateQty with incremented qty when + clicked', () => {
  const onUpdateQty = vi.fn()
  render(<CartItem item={ITEM} onUpdateQty={onUpdateQty} onRemove={() => {}} />)
  fireEvent.click(screen.getByText('+'))
  expect(onUpdateQty).toHaveBeenCalledWith('cart-1', 2)
})

test('calls onUpdateQty with decremented qty when − clicked', () => {
  const onUpdateQty = vi.fn()
  render(<CartItem item={ITEM} onUpdateQty={onUpdateQty} onRemove={() => {}} />)
  fireEvent.click(screen.getByText('−'))
  expect(onUpdateQty).toHaveBeenCalledWith('cart-1', 0)
})
```

- [ ] **Step 2: Run CartItem tests — expect failure**

```bash
npx vitest run src/components/__tests__/CartItem.test.jsx
```

- [ ] **Step 3: Create `src/components/CartItem.jsx`**

```jsx
export default function CartItem({ item, onUpdateQty, onRemove }) {
  const sizeDetail = item.size
    ? `${item.size.slices} fatias${item.borda ? ` · Borda: ${item.borda.name}` : ''}`
    : null
  const total = (item.unitPrice * item.quantity).toFixed(2).replace('.', ',')

  return (
    <div className="bg-white rounded-xl p-3 border border-cream flex gap-3 items-start">
      <div className="flex-1 min-w-0">
        <h4 className="text-dark-brown font-semibold text-sm">{item.name}</h4>
        {sizeDetail && (
          <p className="text-gray-400 text-xs mt-0.5">{sizeDetail}</p>
        )}
        {item.observations && (
          <p className="text-gray-300 text-xs italic mt-0.5">"{item.observations}"</p>
        )}
        <p className="text-terracotta font-semibold text-sm mt-1">R${total}</p>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <button
          onClick={() => onRemove(item.cartId)}
          className="text-gray-300 text-sm leading-none"
        >
          ✕
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQty(item.cartId, item.quantity - 1)}
            className="w-6 h-6 rounded-full bg-cream text-terracotta font-bold text-sm flex items-center justify-center"
          >
            −
          </button>
          <span className="text-dark-brown text-sm w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQty(item.cartId, item.quantity + 1)}
            className="w-6 h-6 rounded-full bg-terracotta text-white font-bold text-sm flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run CartItem tests — expect pass**

```bash
npx vitest run src/components/__tests__/CartItem.test.jsx
```

Expected: 5 passed

- [ ] **Step 5: Replace `src/pages/Cart.jsx`**

```jsx
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
```

- [ ] **Step 6: Commit**

```bash
git add src/components/CartItem.jsx src/components/__tests__/CartItem.test.jsx src/pages/Cart.jsx
git commit -m "feat: add CartItem and Cart page"
```

---

## Task 11: CheckoutForm

**Files:**
- Create: `src/components/CheckoutForm.jsx`
- Create: `src/components/__tests__/CheckoutForm.test.jsx`

- [ ] **Step 1: Write tests**

```jsx
// src/components/__tests__/CheckoutForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import CheckoutForm from '../CheckoutForm'
import useCartStore from '../../store/cartStore'

const mockOpen = vi.fn()
vi.stubGlobal('open', mockOpen)

beforeEach(() => {
  useCartStore.setState({ items: [] })
  mockOpen.mockClear()
})

const ITEMS = [
  {
    name: 'Calabresa',
    size: { slices: 8, price: 49.90 },
    borda: null,
    observations: '',
    unitPrice: 49.90,
    quantity: 1,
  },
]

test('submit button is disabled when name or address is empty', () => {
  render(<CheckoutForm items={ITEMS} />)
  expect(screen.getByRole('button', { name: /Fazer Pedido/i })).toBeDisabled()
})

test('submit button enables when both name and address are filled', () => {
  render(<CheckoutForm items={ITEMS} />)
  fireEvent.change(screen.getByPlaceholderText('Seu nome completo'), {
    target: { value: 'João' },
  })
  fireEvent.change(screen.getByPlaceholderText('Rua, número, bairro'), {
    target: { value: 'Rua A, 1' },
  })
  expect(screen.getByRole('button', { name: /Fazer Pedido/i })).not.toBeDisabled()
})

test('clicking submit opens a WhatsApp URL', () => {
  render(<CheckoutForm items={ITEMS} />)
  fireEvent.change(screen.getByPlaceholderText('Seu nome completo'), {
    target: { value: 'João' },
  })
  fireEvent.change(screen.getByPlaceholderText('Rua, número, bairro'), {
    target: { value: 'Rua A, 1' },
  })
  fireEvent.click(screen.getByRole('button', { name: /Fazer Pedido/i }))
  expect(mockOpen).toHaveBeenCalledWith(
    expect.stringMatching(/wa\.me\/5541998344768/),
    '_blank'
  )
})

test('clears the cart after submit', () => {
  useCartStore.setState({ items: [{ cartId: 'x', quantity: 1 }] })
  render(<CheckoutForm items={ITEMS} />)
  fireEvent.change(screen.getByPlaceholderText('Seu nome completo'), {
    target: { value: 'João' },
  })
  fireEvent.change(screen.getByPlaceholderText('Rua, número, bairro'), {
    target: { value: 'Rua A, 1' },
  })
  fireEvent.click(screen.getByRole('button', { name: /Fazer Pedido/i }))
  expect(useCartStore.getState().items).toHaveLength(0)
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npx vitest run src/components/__tests__/CheckoutForm.test.jsx
```

- [ ] **Step 3: Create `src/components/CheckoutForm.jsx`**

```jsx
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
```

- [ ] **Step 4: Run all tests — expect pass**

```bash
npx vitest run
```

Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add src/components/CheckoutForm.jsx src/components/__tests__/CheckoutForm.test.jsx
git commit -m "feat: add CheckoutForm with WhatsApp order submission"
```

---

## Task 12: Contact page

**Files:**
- Modify: `src/pages/Contact.jsx`

- [ ] **Step 1: Replace `src/pages/Contact.jsx`**

```jsx
const ADDRESS = 'R. Apolônia Bruneti Gugelmim, 107 - Vila Juliana, Piraquara - PR, 83306-130'
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`
const WHATSAPP_URL = 'https://wa.me/5541998344768'

const HOURS = [
  { days: 'Terça a Sexta', time: '19h – 23h', closed: false },
  { days: 'Sábado e Domingo', time: '18h – 23h', closed: false },
  { days: 'Segunda-feira', time: 'Fechado', closed: true },
]

export default function Contact() {
  return (
    <div className="bg-cream min-h-screen pb-20 p-6">
      <div className="text-center mb-8 pt-4">
        <h1 className="font-brand text-5xl italic text-dark-brown mb-1">Sourasso</h1>
        <p className="text-xs text-terracotta tracking-widest uppercase">Pizzaria Artesanal</p>
      </div>

      <div className="bg-white rounded-2xl border border-cream divide-y divide-cream mb-4">
        <div className="p-4">
          <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-2">
            Endereço
          </p>
          <p className="text-dark-brown text-sm leading-relaxed">{ADDRESS}</p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="text-terracotta text-xs font-semibold mt-2 inline-block"
          >
            Ver no Google Maps →
          </a>
        </div>

        <div className="p-4">
          <p className="text-xs font-bold text-terracotta tracking-widest uppercase mb-3">
            Horário de Funcionamento
          </p>
          <div className="space-y-2">
            {HOURS.map(({ days, time, closed }) => (
              <div key={days} className="flex justify-between text-sm">
                <span className={closed ? 'text-gray-300' : 'text-dark-brown'}>{days}</span>
                <span className={`font-medium ${closed ? 'text-gray-300' : 'text-dark-brown'}`}>
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-4 rounded-xl text-sm w-full"
      >
        <span>💬</span> Falar no WhatsApp
      </a>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Navigate to Contact page — confirm address, hours table, and WhatsApp button render correctly.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Contact.jsx
git commit -m "feat: implement Contact page with address, hours and WhatsApp link"
```

---

## Task 13: Final verification

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass, 0 failures

- [ ] **Step 2: Build for production**

```bash
npm run build
```

Expected: `dist/` folder created, no build errors

- [ ] **Step 3: Preview production build**

```bash
npm run preview
```

Open http://localhost:4173 — verify golden path:
1. Home page loads with hero banner
2. Tap a pizza → bottom sheet opens with size selector, borda pills, observations field
3. Add to cart → badge appears on BottomNav
4. Navigate to Cart → item listed with details and total
5. Fill in name, address, select payment → "Fazer Pedido" enables
6. Tap "Fazer Pedido" → WhatsApp opens with formatted message
7. Navigate to Contact → address, hours, and WhatsApp button visible

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Sourasso Pizzaria website v1"
```
