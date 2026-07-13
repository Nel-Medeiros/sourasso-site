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
