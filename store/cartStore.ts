import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (product) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
  clearCart: () => set({ items: [] }),
}));