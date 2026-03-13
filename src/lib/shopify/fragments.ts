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
          handle
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
      {namespace: "custom", key: "Stone Weight"},
      {namespace: "custom", key: "Net Weight"},
      {namespace: "custom", key: "Gross Weight"},
      {namespace: "custom", key: "Certification Available"},
      {namespace: "custom", key: "Certification Authority"},
      {namespace: "custom", key: "Purity Percentage"},
      {namespace: "custom", key: "Purity"},
      {namespace: "custom", key: "Metal Type"},
      {namespace: "custom", key: "Metal Color"},
      {namespace: "custom", key: "Country of Origin"},
      {namespace: "custom", key: "Hallmark Type"},
      {namespace: "custom", key: "Finish Type"},
      {namespace: "custom", key: "Product Type"},
      {namespace: "custom", key: "Jewellery Category"},
      {namespace: "custom", key: "Sub Category"},
      {namespace: "custom", key: "Gender"},
      {namespace: "custom", key: "Occasion"},
      {namespace: "custom", key: "Collection Name"},
      {namespace: "custom", key: "Design Style"},
      {namespace: "custom", key: "SKU Code"},
      {namespace: "custom", key: "Wholesale Price"},
      {namespace: "custom", key: "Purchase Cost"},
      {namespace: "custom", key: "Margin Percentage"},
      {namespace: "custom", key: "MOQ for B2B"},
      {namespace: "custom", key: "B2B Enable"},
      {namespace: "custom", key: "Reorder Level"},
      {namespace: "custom", key: "Zoom Priority Image"},
      {namespace: "custom", key: "360 view available"},
      {namespace: "custom", key: "Model Shot Available"},
      {namespace: "custom", key: "video Available"},
      {namespace: "custom", key: "Highlight Badge"},
      {namespace: "custom", key: "Display Price Breakup"},
      {namespace: "custom", key: "Buy Back Availble"},
      {namespace: "custom", key: "Exchange Available"},
      {namespace: "custom", key: "Return Eligible"},
      {namespace: "custom", key: "Customization Available"},
      {namespace: "custom", key: "Dispatch Time"},
      {namespace: "custom", key: "Ready Stock"},
      {namespace: "custom", key: "Care Instructions"},
      {namespace: "custom", key: "Cleaning Method"},
      {namespace: "custom", key: "Allergy Safe"},
      {namespace: "custom", key: "Skin Friendly"},
      {namespace: "custom", key: "Suitable for daily wear"},
      {namespace: "custom", key: "Light Weight Category"},
      {namespace: "custom", key: "Adjustable Fit"},
      {namespace: "custom", key: "Earring Type"},
      {namespace: "custom", key: "Closure Type"},
      {namespace: "custom", key: "Necklace Type"},
      {namespace: "custom", key: "Necklace Length"},
      {namespace: "custom", key: "Pendant Included"},
      {namespace: "custom", key: "Chain Pattern"},
      {namespace: "custom", key: "Chain Thickness(mm)"},
      {namespace: "custom", key: "Chain Length(inches)"},
      {namespace: "custom", key: "Lock Type"},
      {namespace: "custom", key: "Adjustable chain Available"},
      {namespace: "custom", key: "Bracelet Length(inches)"},
      {namespace: "custom", key: "Bangle Type"},
      {namespace: "custom", key: "Inner Diametre"},
      {namespace: "custom", key: "Bangle Size"},
      {namespace: "custom", key: "Adjustable Length"},
      {namespace: "custom", key: "Ankle Length"},
      {namespace: "custom", key: "Toe Ring Size"},
      {namespace: "custom", key: "Stone Type"},
      {namespace: "custom", key: "Stone Shape"},
      {namespace: "custom", key: "Stone Count"},
      {namespace: "custom", key: "Stone Color"},
      {namespace: "custom", key: "Stone Quality Grade"},
      {namespace: "custom", key: "Stone Setting Type"},
      {namespace: "custom", key: "Price Breakup Enabled"},
      {namespace: "custom", key: "GST Percentage"},
      {namespace: "custom", key: "GST Amount"},
      {namespace: "custom", key: "Metal Rate"},
      {namespace: "custom", key: "Final Metal Value"},
      {namespace: "custom", key: "Making Charge Value"},
      {namespace: "custom", key: "Making Charge Type"},
      {namespace: "custom", key: "Wastage Weight"},
      {namespace: "custom", key: "Wastage Percentage"},
      {namespace: "custom", key: "Vendor Name"},
      {namespace: "custom", key: "Vendor Code"},
      {namespace: "custom", key: "Internal Notes"}
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