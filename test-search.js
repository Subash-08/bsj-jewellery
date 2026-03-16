const https = require('https');
require('dotenv').config({ path: '.env.local' });

const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

const query = `
query searchProducts($query: String!, $productFilters: [ProductFilter!]) {
  search(query: $query, productFilters: $productFilters, first: 10, types: [PRODUCT]) {
    productFilters {
      id
      label
      type
    }
    edges {
      node {
        ... on Product {
          title
        }
      }
    }
  }
}
`;

const data = JSON.stringify({
  query,
  variables: { query: "gold", productFilters: [{ available: true }] }
});

const options = {
  hostname: DOMAIN,
  port: 443,
  path: `/api/${API_VERSION}/graphql.json`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(JSON.stringify(JSON.parse(body), null, 2)));
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
