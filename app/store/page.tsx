'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useCartStoreHydrated } from '../lib/hooks/useCartHydration';
import {
  getAllProducts,
  getProductsByCategory,
  getFeaturedProducts,
  productCategories,
  formatPrice,
  calculateDiscount,
  Product,
} from '../lib/data/products';
import { ShoppingBag, Search, Filter, Star, Heart, ShoppingCart, Percent } from 'lucide-react';

type FilterType = 'all' | string; // 'all' or category id

export default function StorePage() {
  const allProducts = getAllProducts();
  const featuredProducts = getFeaturedProducts();
  const { addItem, openCart } = useCartStoreHydrated();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Get filtered products
  const getFilteredProducts = (): Product[] => {
    let filtered = activeFilter === 'all' ? allProducts : getProductsByCategory(activeFilter);

    if (searchQuery) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter(product => product.featured);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const ProductCard = ({ product }: { product: Product }) => {
    const discount = calculateDiscount(product.price, product.compareAtPrice);

    const handleAddToCart = () => {
      addItem(product);
      openCart();
    };

    return (
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105">
        <div className="aspect-square relative">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <Percent className="h-3 w-3 mr-1" />
              {discount}% OFF
            </div>
          )}

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <Star className="h-3 w-3 mr-1" />
              FEATURED
            </div>
          )}

          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stock indicator */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
              {product.category.name}
            </span>
            {product.stockCount && product.stockCount < 10 && (
              <span className="text-red-400 text-xs">Only {product.stockCount} left</span>
            )}
          </div>

          <h3 className="text-white font-semibold mb-2 group-hover:text-orange-400 transition-colors">
            {product.name}
          </h3>

          <p className="text-white/70 text-sm line-clamp-2 mb-3">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-white/50 line-through text-sm">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <Link href={`/store/${product.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                View Details
              </Button>
            </Link>
          </div>

          {/* Product tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-white/5 text-white/60 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">Official Store</h1>
            <p className="text-white/70 text-lg max-w-3xl mx-auto mb-8">
              Shop exclusive Bugle merchandise, from premium apparel to limited edition
              collectibles. Support the music and wear your passion.
            </p>

            {/* Search and filters */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
                <Button
                  variant={showFeaturedOnly ? 'default' : 'outline'}
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  className={
                    showFeaturedOnly
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'border-white/20 text-white hover:bg-white/10'
                  }
                >
                  <Star className="h-4 w-4 mr-2" />
                  Featured Only
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
              className={
                activeFilter === 'all'
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'border-white/20 text-white hover:bg-white/10'
              }
            >
              All Products ({allProducts.length})
            </Button>
            {productCategories.map(category => {
              const categoryProducts = getProductsByCategory(category.id);
              return (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(category.id)}
                  className={
                    activeFilter === category.id
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'border-white/20 text-white hover:bg-white/10'
                  }
                >
                  {category.name} ({categoryProducts.length})
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              {activeFilter === 'all'
                ? 'All Products'
                : productCategories.find(cat => cat.id === activeFilter)?.name || 'Products'}
              <span className="text-orange-400 ml-2">({filteredProducts.length})</span>
            </h2>

            <div className="flex items-center gap-2 text-white/60">
              <Filter className="h-4 w-4" />
              <span className="text-sm">
                {searchQuery && `"${searchQuery}" • `}
                {showFeaturedOnly && 'Featured • '}
                {filteredProducts.length} results
              </span>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">No products found</h3>
              <p className="text-white/60 mb-4">
                {searchQuery
                  ? `No products match "${searchQuery}"`
                  : `No products available in this category`}
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  setShowFeaturedOnly(false);
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      {activeFilter === 'all' && !searchQuery && featuredProducts.length > 0 && (
        <section className="py-16 sm:py-24 bg-black/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Featured Products</h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Hand-picked favorites and limited edition items you don&apos;t want to miss.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.slice(0, 6).map(product => (
                <ProductCard key={`featured-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
