import { getNavProducts } from '@/lib/shopify/client';
import { buildNavCategoriesFromProducts, HANDLE_MAP } from '@/lib/shopify/nav-utils';
import { CATEGORY_DATA } from '@/lib/categories';
import ShopByCategoryClient from './ShopByCategoryClient';
import type { NavCategory } from '@/types/shopify/collection';

export default async function ShopByCategoryMenu() {

  const diagRes = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: `{
        products(first: 250, query: "title:Tortise") {
          edges {
            node {
              id
              title
              metafields(identifiers: [
                { namespace: "custom", key: "jewellery_category" }
                { namespace: "custom", key: "gender" }
                { namespace: "custom", key: "sub_category" }
                { namespace: "custom", key: "occasion" }
                { namespace: "custom", key: "collection_name" }
                { namespace: "custom", key: "design_style" }
              ]) {
                key
                value
              }
            }
          }
        }
      }`
      }),
      cache: 'no-store',
    }
  );
  const diagData = await diagRes.json();

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