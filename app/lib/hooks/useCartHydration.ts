'use client';
import { useEffect, useState } from 'react';
import { useCartStore } from '../store/cart';

// Hook to handle hydration safely
export const useCartHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};

// Safe cart store hook that prevents hydration issues
export const useCartStoreHydrated = () => {
  const isHydrated = useCartHydration();
  const store = useCartStore();

  if (!isHydrated) {
    // Return safe default values during SSR
    return {
      ...store,
      items: [],
      isOpen: false,
      getItemCount: () => 0,
      getCartSummary: () => ({
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        itemCount: 0,
      }),
    };
  }

  return store;
};
