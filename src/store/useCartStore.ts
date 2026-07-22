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
        const existingItem = state.items.find(i => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
        return { items: [...state.items, item] };
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
