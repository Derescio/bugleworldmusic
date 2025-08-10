'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { useCartStoreHydrated } from '../../lib/hooks/useCartHydration';
import {
  formatPrice,
  calculateDiscount,
  getProductsByCategory,
  Product,
} from '../../lib/data/products';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Percent,
  Tag,
} from 'lucide-react';

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addItem, openCart } = useCartStoreHydrated();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const relatedProducts = getProductsByCategory(product.category.id)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity: 1,
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link href="/store">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/30 shadow-2xl">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Percent className="h-3 w-3 mr-1" />
                    {discount}% OFF
                  </div>
                )}
                {product.featured && (
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    FEATURED
                  </div>
                )}
                {!product.inStock && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    OUT OF STOCK
                  </div>
                )}
              </div>
            </div>

            {/* Additional Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${product.name} - View ${index + 2}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-200 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                  {product.category.name}
                </span>
                {product.stockCount && product.stockCount < 10 && (
                  <span className="text-red-400 text-sm font-medium">
                    Only {product.stockCount} left in stock
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-white/50 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      Save {formatPrice(product.compareAtPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              <p className="text-white/80 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Product Options */}
            {(product.sizes || product.colors) && (
              <div className="space-y-4">
                {product.sizes && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? 'default' : 'outline'}
                          onClick={() => setSelectedSize(size)}
                          className={
                            selectedSize === size
                              ? 'bg-orange-500 hover:bg-orange-600'
                              : 'border-white/20 text-white hover:bg-orange-500 hover:border-orange-500'
                          }
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Color</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <Button
                          key={color}
                          variant={selectedColor === color ? 'default' : 'outline'}
                          onClick={() => setSelectedColor(color)}
                          className={
                            selectedColor === color
                              ? 'bg-orange-500 hover:bg-orange-600'
                              : 'border-white/20 text-white hover:bg-orange-500 hover:border-orange-500'
                          }
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/20 text-white hover:bg-white/10"
                disabled={!product.inStock}
              >
                Buy Now
              </Button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 text-white/70">
                <Truck className="h-5 w-5 text-orange-400" />
                <div>
                  <div className="text-sm font-medium text-white">Free Shipping</div>
                  <div className="text-xs">On orders over $50</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/70">
                <Shield className="h-5 w-5 text-orange-400" />
                <div>
                  <div className="text-sm font-medium text-white">Secure Payment</div>
                  <div className="text-xs">SSL encrypted</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/70">
                <RotateCcw className="h-5 w-5 text-orange-400" />
                <div>
                  <div className="text-sm font-medium text-white">Easy Returns</div>
                  <div className="text-xs">30-day policy</div>
                </div>
              </div>
            </div>

            {/* Product Tags */}
            <div>
              <h3 className="text-white font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm flex items-center"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-white/10">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Related Products</h2>
              <p className="text-white/70">More items from the {product.category.name} category</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Link
                  key={relatedProduct.id}
                  href={`/store/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="aspect-square relative">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        {relatedProduct.compareAtPrice && (
                          <span className="text-white/50 line-through text-sm">
                            {formatPrice(relatedProduct.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
