import { toJsonLd } from './jsonld';
import type { Product } from '@/types/shopify/product';

export function StructuredData({ product }: { product: Product }) {
  const jsonLd = toJsonLd(product);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }
      }
    />
  );
}