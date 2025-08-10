import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../data/products';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number; // Price at time of adding to cart
  addedAt: string;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface CartStore {
  // State
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (
    product: Product,
    options?: { size?: string; color?: string; quantity?: number }
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed values
  getCartSummary: () => CartSummary;
  getItemCount: () => number;
  getItemById: (itemId: string) => CartItem | undefined;
  hasItem: (productId: string, size?: string, color?: string) => boolean;
}

// Tax rate (8.5%)
const TAX_RATE = 0.085;

// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 5000; // $50 in cents

// Shipping cost
const SHIPPING_COST = 899; // $8.99 in cents

// Generate unique cart item ID
const generateCartItemId = (productId: string, size?: string, color?: string): string => {
  return `${productId}-${size || 'default'}-${color || 'default'}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,

      // Actions
      addItem: (product, options = {}) => {
        const { size, color, quantity = 1 } = options;
        const itemId = generateCartItemId(product.id, size, color);

        set(state => {
          const existingItemIndex = state.items.findIndex(item => item.id === itemId);

          if (existingItemIndex >= 0) {
            // Update existing item quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
            };

            return { items: updatedItems };
          } else {
            // Add new item
            const newItem: CartItem = {
              id: itemId,
              productId: product.id,
              product,
              quantity,
              size,
              color,
              price: product.price,
              addedAt: new Date().toISOString(),
            };

            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: itemId => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set(state => ({
          items: state.items.map(item => (item.id === itemId ? { ...item, quantity } : item)),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      // Computed values
      getCartSummary: () => {
        const items = get().items;
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = Math.round(subtotal * TAX_RATE);
        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const discount = 0; // Will be used for coupon codes later
        const total = subtotal + tax + shipping - discount;
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        return {
          subtotal,
          tax,
          shipping,
          discount,
          total,
          itemCount,
        };
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getItemById: itemId => {
        return get().items.find(item => item.id === itemId);
      },

      hasItem: (productId, size, color) => {
        const itemId = generateCartItemId(productId, size, color);
        return get().items.some(item => item.id === itemId);
      },
    }),
    {
      name: 'bugle-cart-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),

      // Only persist cart items, not UI state like isOpen
      partialize: state => ({ items: state.items }),
    }
  )
);

// Utility functions for formatting
export const formatPrice = (priceInCents: number): string => {
  return `$${(priceInCents / 100).toFixed(2)}`;
};

// Hook for cart summary with formatted prices
export const useFormattedCartSummary = () => {
  const getCartSummary = useCartStore(state => state.getCartSummary);
  const summary = getCartSummary();

  return {
    ...summary,
    formattedSubtotal: formatPrice(summary.subtotal),
    formattedTax: formatPrice(summary.tax),
    formattedShipping: summary.shipping === 0 ? 'FREE' : formatPrice(summary.shipping),
    formattedDiscount: formatPrice(summary.discount),
    formattedTotal: formatPrice(summary.total),
  };
};
