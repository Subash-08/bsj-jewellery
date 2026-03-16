require('dotenv').config({path: '.env.local'});
const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
const endpoint = `https://${storeDomain}`;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || '2024-01';

(async () => {
  // 1. ProductFilter input fields
  const r1 = await fetch(`${endpoint}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `{ __type(name:"ProductFilter"){inputFields{name type{name kind ofType{name}}}} }` })
  });
  const j1 = await r1.json();
  console.log('=== ProductFilter fields ===');
  j1.data?.__type?.inputFields?.forEach(f => console.log(' -', f.name));

  // 2. Does search return productFilters field?
  const r2 = await fetch(`${endpoint}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `{ __type(name:"SearchResultItemConnection"){fields{name type{name kind}}} }` })
  });
  const j2 = await r2.json();
  console.log('\n=== SearchResultItemConnection fields ===');
  j2.data?.__type?.fields?.forEach(f => console.log(' -', f.name));

  // 3. Does collection.products return filters field?
  const r3 = await fetch(`${endpoint}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `{ __type(name:"ProductConnection"){fields{name type{name kind}}} }` })
  });
  const j3 = await r3.json();
  console.log('\n=== ProductConnection fields ===');
  j3.data?.__type?.fields?.forEach(f => console.log(' -', f.name));

  // 4. Test { available: true } productFilter on search
  const r4 = await fetch(`${endpoint}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `{ search(query:"gold",first:3,types:[PRODUCT],productFilters:[{available:true}]){edges{node{...on Product{title availableForSale}}}productFilters{id label type values{id label count}}} }` })
  });
  const j4 = await r4.json();
  console.log('\n=== search+productFilters response ===');
  if (j4.errors) { console.log('ERRORS:', JSON.stringify(j4.errors)); }
  else { 
    console.log('Products:', j4.data?.search?.edges?.map(e => e.node.title));
    console.log('productFilters returned:', j4.data?.search?.productFilters?.map(f => f.label));
  }
})();
