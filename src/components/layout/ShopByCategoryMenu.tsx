import { getNavProducts } from '@/lib/shopify/client';
import { buildNavCategoriesFromProducts, HANDLE_MAP } from '@/lib/shopify/nav-utils';
import { CATEGORY_DATA } from '@/lib/categories';
import ShopByCategoryClient from './ShopByCategoryClient';
import type { NavCategory } from '@/types/shopify/collection';

export default async function ShopByCategoryMenu() {


  let categories: NavCategory[];
  try {
    const products = await getNavProducts();
    categories = buildNavCategoriesFromProducts(products);
    if (categories.length === 0) throw new Error('empty');
  } catch (e) {
    console.error('[Nav] Fallback triggered:', e);
    categories = CATEGORY_DATA.map((cat) => ({
      id: cat.id,
      name: cat.name,
      handle: HANDLE_MAP[cat.id] || cat.id,
      subCategories: [...cat.subCategories],
      gender: [...cat.gender],
      occasion: [...cat.occasion],
      collection: [...cat.collection],
      design: [...cat.design],
    }));
  }
  return <ShopByCategoryClient categories={categories} />;
}