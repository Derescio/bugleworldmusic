import { notFound } from 'next/navigation';
import { getProductById, getAllProducts } from '../../lib/data/products';
import ProductPageClient from './ProductPageClient';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map(product => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found - Bugle Store',
    };
  }

  return {
    title: `${product.name} - Bugle Store`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Bugle Store`,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
