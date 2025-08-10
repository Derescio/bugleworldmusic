'use client';
import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, CartItem } from '../../lib/store/cart';
import { useCartStoreHydrated } from '../../lib/hooks/useCartHydration';
import { Button } from '../ui/button';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Truck } from 'lucide-react';

export default function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getCartSummary } =
    useCartStoreHydrated();

  const summary = getCartSummary();
  const formattedSummary = {
    ...summary,
    formattedSubtotal: formatPrice(summary.subtotal),
    formattedTax: formatPrice(summary.tax),
    formattedShipping: summary.shipping === 0 ? 'FREE' : formatPrice(summary.shipping),
    formattedDiscount: formatPrice(summary.discount),
    formattedTotal: formatPrice(summary.total),
  };

  if (!isOpen) return null;

  const CartItemComponent = ({ item }: { item: CartItem }) => (
    <div className="flex gap-4 p-4 border-b border-white/10">
      <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm mb-1 truncate">{item.product.name}</h4>

        {(item.size || item.color) && (
          <div className="flex gap-2 mb-2">
            {item.size && (
              <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
                {item.size}
              </span>
            )}
            {item.color && (
              <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
                {item.color}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-white text-sm font-medium w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm">
              {formatPrice(item.price * item.quantity)}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400 hover:text-red-300 p-1"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeCart} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 z-50 shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Cart ({formattedSummary.itemCount})
            </h2>
            <button onClick={closeCart} className="text-white/60 hover:text-white p-2">
              <X className="h-5 w-5" />
            </button>
          </div>

          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingBag className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-white/60 mb-6">Add some products to get started</p>
                <Button asChild className="bg-orange-500 hover:bg-orange-600" onClick={closeCart}>
                  <Link href="/store">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {items.map(item => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-white/10 p-6 space-y-4">
                {/* Shipping Notice */}
                {formattedSummary.shipping > 0 && (
                  <div className="flex items-center gap-2 text-sm text-orange-400 bg-orange-500/10 p-3 rounded-lg">
                    <Truck className="h-4 w-4" />
                    <span>
                      Add {formatPrice(5000 - formattedSummary.subtotal)} more for free shipping
                    </span>
                  </div>
                )}

                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>{formattedSummary.formattedSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Tax</span>
                    <span>{formattedSummary.formattedTax}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span className={formattedSummary.shipping === 0 ? 'text-green-400' : ''}>
                      {formattedSummary.formattedShipping}
                    </span>
                  </div>
                  {formattedSummary.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-{formattedSummary.formattedDiscount}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>{formattedSummary.formattedTotal}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Link href="/checkout">
                      Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={closeCart}
                  >
                    <Link href="/store">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
