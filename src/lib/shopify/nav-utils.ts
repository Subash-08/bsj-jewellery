import type { NavCategory } from '@/types/shopify/collection';

type NavProduct = {
  title: string;
  metafields: { key: string; value: string | null }[];
};

export const HANDLE_MAP: Record<string, string> = {
  'rings': 'ring',
  'necklaces': 'necklace',
  'earrings': 'earring',
  'bangles': 'bangle',
  'anklets': 'anklet',
  'chains': 'chain',
  'pendants': 'pendant',
};

export function buildNavCategoriesFromProducts(products: NavProduct[]): NavCategory[] {
  const categoryMap = new Map<string, NavCategory>();

  for (const product of products) {
    const getMf = (key: string) =>
      product.metafields.find((m) => m.key === key)?.value ?? null;

    const categoryName = getMf('jewellery_category');
    if (!categoryName) continue;

    const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        id: categoryId,
        name: categoryName,
        handle: HANDLE_MAP[categoryId] || categoryId,
        subCategories: [],
        gender: [],
        occasion: [],
        collection: [],
        design: [],
      });
    }

    const cat = categoryMap.get(categoryId)!;

    const merge = (arr: string[], key: string) => {
      const val = getMf(key);
      if (val && !arr.includes(val)) arr.push(val);
    };

    merge(cat.subCategories, 'sub_category');
    merge(cat.gender, 'gender');
    merge(cat.occasion, 'occasion');
    merge(cat.collection, 'collection_name');
    merge(cat.design, 'design_style');
  }

  return Array.from(categoryMap.values());
}
