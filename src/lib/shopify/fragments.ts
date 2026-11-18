const seoFragment = /* GraphQL */ `
  fragment seo on SEO {
    description
    title
  }
`;

const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;

const priceFragment = /* GraphQL */ `
  fragment price on MoneyV2 {
    amount
    currencyCode
  }
`;

const metafieldFragment = /* GraphQL */ `
  fragment metafieldFragment on Metafield {
    id
    namespace
    key
    value
    type
  }
`;

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    productType
    tags
    options {
      id
      name
      values
    }
    collections(first: 10) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "metal_purity"},
      {namespace: "custom", key: "net_weight"},
      {namespace: "custom", key: "metal_type"},
      {namespace: "custom", key: "jewellery_category"},
      {namespace: "custom", key: "sub_category"},
      {namespace: "custom", key: "gender"},
      {namespace: "custom", key: "occasion"},
      {namespace: "custom", key: "design_style"},
      {namespace: "custom", key: "ring_weight"},
      {namespace: "custom", key: "bracelet_weight"},
      {namespace: "custom", key: "anklet_weight"},
      {namespace: "custom", key: "anklet_purity"},
      {namespace: "custom", key: "pendant_weight"},
      {namespace: "custom", key: "chain_size"},
      {namespace: "custom", key: "chain_weight"},
      {namespace: "custom", key: "ringsize"},
      {namespace: "custom", key: "anklet_size_and_fit_details"}
    ]) {
        ...metafieldFragment
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          sku
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
  ${metafieldFragment}
`;

const filterFragment = /* GraphQL */ `
  fragment filter on Filter {
    id
    label
    type
    values {
      id
      label
      count
      input
    }
  }
`;

const pageInfoFragment = /* GraphQL */ `
  fragment pageInfo on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    cost {
      subtotalAmount {
        ...price
      }
      totalAmount {
        ...price
      }
      totalTaxAmount {
        ...price
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...price
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                id
                handle
                title
                featuredImage {
                  ...image
                }
              }
            }
          }
        }
      }
    }
    totalQuantity
  }
  ${imageFragment}
  ${priceFragment}
`;

export {
  seoFragment,
  imageFragment,
  priceFragment,
  productFragment,
  cartFragment,
  filterFragment,
  pageInfoFragment,
};
