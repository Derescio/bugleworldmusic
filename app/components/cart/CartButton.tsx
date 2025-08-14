'use client';
import { useCartStoreHydrated } from '../../lib/hooks/useCartHydration';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';

export default function CartButton() {
  const { getItemCount, toggleCart } = useCartStoreHydrated();
  const itemCount = getItemCount();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleCart}
      className="relative border-white/20 text-white hover:bg-white/10"
    >
      <ShoppingCart className="h-4 w-4 " />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Button>
  );
}
