import { describe, it, expect } from 'vitest';
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getProductsByTag,
  searchProducts,
  formatPrice,
  calculateDiscount,
} from '../products';

describe('Product Data Functions', () => {
  describe('getAllProducts', () => {
    it('should return all products', () => {
      const products = getAllProducts();
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBeGreaterThan(0);
    });

    it('should return products with required properties', () => {
      const products = getAllProducts();
      const firstProduct = products[0];

      expect(firstProduct).toHaveProperty('id');
      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('description');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('images');
      expect(firstProduct).toHaveProperty('category');
      expect(firstProduct).toHaveProperty('inStock');
      expect(firstProduct).toHaveProperty('featured');
      expect(firstProduct).toHaveProperty('tags');
    });
  });

  describe('getProductById', () => {
    it('should return product by valid ID', () => {
      const product = getProductById('bugle-logo-tshirt-black');
      expect(product).toBeDefined();
      expect(product?.id).toBe('bugle-logo-tshirt-black');
      expect(product?.name).toBe('Bugle Logo T-Shirt - Black');
    });

    it('should return undefined for invalid ID', () => {
      const product = getProductById('non-existent-id');
      expect(product).toBeUndefined();
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category', () => {
      const apparelProducts = getProductsByCategory('apparel');
      expect(apparelProducts).toBeInstanceOf(Array);
      expect(apparelProducts.length).toBeGreaterThan(0);

      apparelProducts.forEach(product => {
        expect(product.category.id).toBe('apparel');
      });
    });

    it('should return empty array for non-existent category', () => {
      const products = getProductsByCategory('non-existent-category');
      expect(products).toEqual([]);
    });
  });

  describe('getFeaturedProducts', () => {
    it('should return only featured products', () => {
      const featuredProducts = getFeaturedProducts();
      expect(featuredProducts).toBeInstanceOf(Array);

      featuredProducts.forEach(product => {
        expect(product.featured).toBe(true);
      });
    });
  });

  describe('getProductsByTag', () => {
    it('should return products by tag', () => {
      const tshirtProducts = getProductsByTag('t-shirt');
      expect(tshirtProducts).toBeInstanceOf(Array);

      tshirtProducts.forEach(product => {
        expect(product.tags).toContain('t-shirt');
      });
    });

    it('should return empty array for non-existent tag', () => {
      const products = getProductsByTag('non-existent-tag');
      expect(products).toEqual([]);
    });
  });

  describe('searchProducts', () => {
    it('should search products by name', () => {
      const results = searchProducts('T-Shirt');
      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBeGreaterThan(0);

      results.forEach(product => {
        expect(product.name.toLowerCase()).toContain('t-shirt');
      });
    });

    it('should search products by description', () => {
      const results = searchProducts('cotton');
      expect(results).toBeInstanceOf(Array);

      const hasDescriptionMatch = results.some(product =>
        product.description.toLowerCase().includes('cotton')
      );
      expect(hasDescriptionMatch).toBe(true);
    });

    it('should search products by tags', () => {
      const results = searchProducts('hoodie');
      expect(results).toBeInstanceOf(Array);

      const hasTagMatch = results.some(product =>
        product.tags.some(tag => tag.toLowerCase().includes('hoodie'))
      );
      expect(hasTagMatch).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = searchProducts('xyz123nonexistent');
      expect(results).toEqual([]);
    });

    it('should be case insensitive', () => {
      const lowerResults = searchProducts('t-shirt');
      const upperResults = searchProducts('T-SHIRT');
      const mixedResults = searchProducts('T-sHiRt');

      expect(lowerResults).toEqual(upperResults);
      expect(upperResults).toEqual(mixedResults);
    });
  });

  describe('formatPrice', () => {
    it('should format price in cents to dollars', () => {
      expect(formatPrice(2499)).toBe('$24.99');
      expect(formatPrice(1000)).toBe('$10.00');
      expect(formatPrice(99)).toBe('$0.99');
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should handle large prices', () => {
      expect(formatPrice(999999)).toBe('$9999.99');
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate discount percentage correctly', () => {
      expect(calculateDiscount(2499, 2999)).toBe(17); // (2999-2499)/2999 * 100 = 16.67, rounded to 17
      expect(calculateDiscount(1000, 2000)).toBe(50);
      expect(calculateDiscount(7500, 10000)).toBe(25);
    });

    it('should return 0 for no discount', () => {
      expect(calculateDiscount(2999, 2999)).toBe(0);
      expect(calculateDiscount(2999, undefined)).toBe(0);
      expect(calculateDiscount(2999)).toBe(0);
    });

    it('should return 0 when price is higher than compare price', () => {
      expect(calculateDiscount(3000, 2999)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(calculateDiscount(0, 100)).toBe(100);
      expect(calculateDiscount(1, 100)).toBe(99);
    });
  });
});
