export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number; // For showing discounts
  images: string[];
  category: ProductCategory;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  stockCount?: number;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Mock product categories
export const productCategories: ProductCategory[] = [
  {
    id: 'apparel',
    name: 'Apparel',
    slug: 'apparel',
    description: "T-shirts, hoodies, and clothing featuring Bugle's brand",
    image: '/images/store/categories/apparel.jpg',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Hats, bags, and other accessories',
    image: '/images/store/categories/accessories.jpg',
  },
  {
    id: 'music',
    name: 'Music & Media',
    slug: 'music-media',
    description: 'Physical albums, vinyl records, and digital downloads',
    image: '/images/store/categories/music.jpg',
  },
  {
    id: 'collectibles',
    name: 'Collectibles',
    slug: 'collectibles',
    description: 'Limited edition items and exclusive merchandise',
    image: '/images/store/categories/collectibles.jpg',
  },
];

// Mock products data
export const products: Product[] = [
  {
    id: 'bugle-logo-tshirt-black',
    name: 'Bugle Logo T-Shirt - Black',
    description:
      'Premium cotton t-shirt featuring the iconic Bugle logo. Comfortable fit perfect for concerts and everyday wear.',
    price: 2499, // Price in cents
    compareAtPrice: 2999,
    images: [
      '/images/store/products/tshirt-black-front.jpg',
      '/images/store/products/tshirt-black-back.jpg',
    ],
    category: productCategories[0], // Apparel
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Navy'],
    inStock: true,
    stockCount: 50,
    featured: true,
    tags: ['t-shirt', 'logo', 'cotton', 'unisex'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'reggae-vibes-hoodie',
    name: 'Reggae Vibes Hoodie',
    description:
      "Cozy fleece hoodie with 'Reggae Vibes' design. Perfect for those cool evenings and showing your love for conscious music.",
    price: 4999,
    images: [
      '/images/store/products/hoodie-reggae-front.jpg',
      '/images/store/products/hoodie-reggae-lifestyle.jpg',
    ],
    category: productCategories[0], // Apparel
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Forest Green', 'Black', 'Burgundy'],
    inStock: true,
    stockCount: 25,
    featured: true,
    tags: ['hoodie', 'reggae', 'fleece', 'unisex'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'bugle-snapback-cap',
    name: 'Bugle Snapback Cap',
    description:
      'Adjustable snapback cap with embroidered Bugle logo. Classic design that goes with everything.',
    price: 2999,
    images: [
      '/images/store/products/cap-snapback-front.jpg',
      '/images/store/products/cap-snapback-side.jpg',
    ],
    category: productCategories[1], // Accessories
    colors: ['Black/Gold', 'Navy/White', 'All Black'],
    inStock: true,
    stockCount: 40,
    featured: false,
    tags: ['cap', 'hat', 'snapback', 'embroidered'],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'patience-vinyl-record',
    name: 'Patience God & Time - Vinyl Record',
    description:
      "Limited edition vinyl pressing of Bugle's acclaimed album 'Patience God & Time'. Includes digital download code.",
    price: 3499,
    images: [
      '/images/store/products/vinyl-patience-front.jpg',
      '/images/store/products/vinyl-patience-back.jpg',
    ],
    category: productCategories[2], // Music & Media
    inStock: true,
    stockCount: 15,
    featured: true,
    tags: ['vinyl', 'album', 'limited-edition', 'music'],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'concert-tote-bag',
    name: 'Bugle Concert Tote Bag',
    description:
      'Durable canvas tote bag perfect for carrying your essentials to concerts and festivals. Features tour dates design.',
    price: 1999,
    images: [
      '/images/store/products/tote-bag-front.jpg',
      '/images/store/products/tote-bag-lifestyle.jpg',
    ],
    category: productCategories[1], // Accessories
    colors: ['Natural', 'Black'],
    inStock: true,
    stockCount: 30,
    featured: false,
    tags: ['bag', 'tote', 'canvas', 'concert'],
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'signed-photo-limited',
    name: 'Signed Photo - Limited Edition',
    description:
      'Professionally signed 8x10 photo of Bugle. Limited to 100 pieces worldwide. Certificate of authenticity included.',
    price: 4999,
    compareAtPrice: 5999,
    images: [
      '/images/store/products/signed-photo-front.jpg',
      '/images/store/products/signed-photo-certificate.jpg',
    ],
    category: productCategories[3], // Collectibles
    inStock: true,
    stockCount: 8,
    featured: true,
    tags: ['signed', 'photo', 'limited-edition', 'collectible', 'authentic'],
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
];

// Utility functions
export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(product => product.category.id === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured);
}

export function getProductsByTag(tag: string): Product[] {
  return products.filter(product => product.tags.includes(tag));
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

export function calculateDiscount(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
