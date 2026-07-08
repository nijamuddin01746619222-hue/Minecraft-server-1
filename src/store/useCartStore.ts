import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  discount?: number;
  quantity: number;
  image?: string;
  category?: string;
  type?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        // We will just add it. If they buy now, maybe we should clear cart first?
        // Let's clear cart if they use Buy Now on product page, so they only checkout this item.
        // But for generic add, we append.
        return { items: [item] }; // Assuming "Buy Now" behavior: only 1 item at a time in checkout based on user flow.
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      })),
      clearCart: () => set({ items: [] }),
      getSubtotal: () => {
        const items = get().items;
        return items.reduce((acc, item) => {
          let price = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
          
          return acc + price * item.quantity;
        }, 0);
      },
      getTotal: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, subtotal);
      },
    }),
    {
      name: 'minecraft-cart',
    }
  )
);
