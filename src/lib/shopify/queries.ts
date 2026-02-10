// q: Why doesn't this file import types? A: It uses them in implementations but the queries are string constants.

import { productFragment, seoFragment, cartFragment } from './fragments';

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

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
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
      }
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
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
            lineItems(first: 5) {
                edges {
                    node {
                        title
                        quantity
                    }
                }
            }
          }
        }
      }
    }
  }
`;