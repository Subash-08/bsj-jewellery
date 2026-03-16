// q: Why doesn't this file import types? A: It uses them in implementations but the queries are string constants.

import { productFragment, seoFragment, cartFragment, filterFragment, pageInfoFragment } from './fragments';

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      handle
      title
      description
      seo {
        ...seo
      }
      updatedAt
      image {
        url
        altText
        width
        height
      }
      products(first: 100) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${seoFragment}
  ${productFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
    $after: String
  ) {
    collection(handle: $handle) {
      products(first: 24, after: $after, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...product
          }
        }
        filters {
          ...filter
        }
        pageInfo {
          ...pageInfo
        }
      }
    }
  }
  ${productFragment}
  ${filterFragment}
  ${pageInfoFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          handle
          title
          description
          seo {
            ...seo
          }
          updatedAt
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
  ${seoFragment}
`;

export const getNavProductsQuery = /* GraphQL */ `
  query getNavProducts {
    products(first: 250) {
      edges {
        node {
          id
          title
          metafields(identifiers: [
  { namespace: "custom", key: "jewellery_category" }
            { namespace: "custom", key: "sub_category" }
            { namespace: "custom", key: "gender" }
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
  }
`;

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String, $after: String) {
    products(first: 24, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          ...product
        }
      }
      pageInfo {
        ...pageInfo
      }
    }
  }
  ${productFragment}
  ${pageInfoFragment}
`;

export const predictiveSearchQuery = /* GraphQL */ `
  query predictiveSearch($query: String!, $limit: Int!) {
    predictiveSearch(query: $query, limit: $limit, types: [PRODUCT, COLLECTION, QUERY]) {
      products {
        id
        title
        handle
        availableForSale
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
      collections {
        id
        title
        handle
      }
      queries {
        text
        styledText
      }
    }
  }
`;

export const searchProductsQuery = /* GraphQL */ `
  query searchProducts(
    $query: String!
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $productFilters: [ProductFilter!]
    $after: String
  ) {
    search(query: $query, first: 24, after: $after, sortKey: $sortKey, reverse: $reverse, productFilters: $productFilters, types: [PRODUCT]) {
      edges {
        node {
          ... on Product {
            ...product
          }
        }
      }
      productFilters {
        ...filter
      }
      pageInfo {
        ...pageInfo
      }
    }
  }
  ${productFragment}
  ${filterFragment}
  ${pageInfoFragment}
`;

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

export const getCustomerQuery = /* GraphQL */ `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        province
        zip
        country
        phone
      }
      addresses(first: 20) {
        edges {
          node {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            zip
            country
            phone
          }
        }
      }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              phone
            }
            lineItems(first: 20) {
                edges {
                    node {
                        title
                        quantity
                        variant {
                          image {
                            url
                            altText
                          }
                          price {
                            amount
                            currencyCode
                          }
                        }
                    }
                }
            }
          }
        }
      }
    }
  }
`;