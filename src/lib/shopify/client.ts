import { shopifyFetch } from './fetch';
import {
    createCartMutation,
    addToCartMutation,
    removeFromCartMutation,
    editCartLinesMutation,
    updateCartBuyerIdentityMutation,
    createCheckoutCartMutation,
} from './mutations';
import {
    customerAccessTokenCreateMutation,
    customerAccessTokenDeleteMutation,
    customerCreateMutation,
    customerRecoverMutation,
    customerResetMutation,
    customerUpdateMutation,
    customerAddressCreateMutation,
    customerAddressUpdateMutation,
    customerAddressDeleteMutation,
    customerDefaultAddressUpdateMutation,
} from './auth-mutations';
import {
    getProductQuery,
    getProductsQuery,
    getCollectionQuery,
    getCollectionsQuery,
    getCollectionProductsQuery,
    getCartQuery,
    getCustomerQuery,
    getNavProductsQuery,
} from './queries';
import type { Product, Filter, PageInfo } from '@/types/shopify/product';
import type { Connection } from '@/types/shopify/image';
import type { Cart } from '@/types/shopify/cart';
import type { Collection } from '@/types/shopify/collection';
import { parseMetafields } from '@/lib/utils/metafield-parser';

// Reshape function to parse metafields and flatten edges
function reshapeProduct(rawProduct: any): Product | undefined {
    if (!rawProduct) return undefined;

    const metafields = rawProduct.metafields?.edges?.map((edge: any) => edge.node) || [];
    const parsedMetafields = parseMetafields(metafields);

    return {
        ...rawProduct,
        // Ensure we keep existing transformations from fragments if any, but flatten edges here
        metafields,
        jewelryMetafields: parsedMetafields,
        images: rawProduct.images?.edges?.map((edge: any) => edge.node) || [],
        variants: rawProduct.variants?.edges?.map((edge: any) => edge.node) || [],
        featuredImage: rawProduct.images?.edges?.[0]?.node, // Fallback logic
    };
}

export async function getProduct(handle: string): Promise<Product | undefined> {
    const res = await shopifyFetch<{ product: Product }>({
        query: getProductQuery,
        variables: { handle },
        tags: [`products-${handle}`],
    });
    return reshapeProduct(res.body.product);
}

// Alias for getProduct as per requirement
export const getProductByHandle = getProduct;

export async function getProducts({
    sortKey,
    reverse,
    query,
    after,
}: {
    sortKey?: string;
    reverse?: boolean;
    query?: string;
    after?: string;
} = {}): Promise<{ products: Product[]; pageInfo: PageInfo }> {
    const res = await shopifyFetch<{
        products: {
            edges: Array<{ node: Product }>;
            pageInfo: PageInfo;
        };
    }>({
        query: getProductsQuery,
        variables: { sortKey, reverse, query, after },
        tags: query ? [`search-${query}`] : ['products'],
    });
    const rawProducts = res.body.products.edges.map((edge) => edge.node);
    const products = rawProducts
        .map(reshapeProduct)
        .filter((p): p is Product => p !== undefined);
    return {
        products,
        pageInfo: res.body.products.pageInfo,
    };
}

export async function getSearchResults({
    query,
    sortKey,
    reverse,
    productFilters,
    after,
}: {
    query: string;
    sortKey?: string;
    reverse?: boolean;
    productFilters?: any[];
    after?: string;
}): Promise<{ products: Product[]; filters: Filter[]; pageInfo: PageInfo }> {
    const res = await shopifyFetch<{
        search: {
            edges: Array<{ node: Product }>;
            productFilters: Filter[];
            pageInfo: PageInfo;
        };
    }>({
        query: require('./queries').searchProductsQuery,
        variables: { query, sortKey, reverse, productFilters, after },
        tags: [`search-${query}`],
    });

    const searchData = res.body.search;
    if (!searchData) {
        return { products: [], filters: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null } };
    }

    const rawProducts = searchData.edges.map((edge) => edge.node);
    const products = rawProducts
        .map(reshapeProduct)
        .filter((p): p is Product => p !== undefined);

    return {
        products,
        filters: searchData.productFilters || [],
        pageInfo: searchData.pageInfo,
    };
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
    const res = await shopifyFetch<{ collection: Collection }>({
        query: getCollectionQuery,
        variables: { handle },
        tags: [`collections-${handle}`],
    });
    // Note: Collections might need similar reshaping if their products field is used extensively,
    // but typically getCollection returns products as edges.
    // For now, if we access products via getCollection, we should reshape them too if needed.
    // The current getCollectionQuery returns products connection.
    if (!res.body.collection) return undefined;

    // Optional: Reshape products inside collection if needed by UI
    // const products = res.body.collection.products.edges.map(e => reshapeProduct(e.node));
    return res.body.collection;
}

export async function getCollectionProducts({
    handle,
    sortKey,
    reverse,
    filters,
    after,
}: {
    handle: string;
    sortKey?: string;
    reverse?: boolean;
    filters?: any[];
    after?: string;
}): Promise<{ products: Product[]; filters: Filter[]; pageInfo: PageInfo } | undefined> {
    const res = await shopifyFetch<{
        collection: {
            products: {
                edges: Array<{ node: Product }>;
                filters: Filter[];
                pageInfo: PageInfo;
            };
        };
    }>({
        query: getCollectionProductsQuery,
        variables: { handle, sortKey, reverse, filters, after },
        tags: [`collections-${handle}`],
    });

    if (!res.body.collection) {
        return undefined;
    }

    const products = res.body.collection.products;
    const shopifyFilters = products.filters;
    const pageInfo = products.pageInfo;
    
    // Check if products is undefined just in case
    if (!products) {
       return { products: [], filters: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null } };
    }

    const rawProducts = products.edges.map((edge) => edge.node);
    const reshapedProducts = rawProducts
        .map(reshapeProduct)
        .filter((p): p is Product => p !== undefined);

    return {
        products: reshapedProducts,
        filters: shopifyFilters,
        pageInfo,
    };
}

export async function getCollections(): Promise<Collection[]> {
    const res = await shopifyFetch<{
        collections: Connection<Collection>;
    }>({
        query: getCollectionsQuery,
        tags: ['collections'],
    });
    return res.body.collections.edges.map((edge) => edge.node);
}

export async function getNavProducts(): Promise<{ title: string; metafields: { key: string; value: string | null }[] }[]> {
  const res = await shopifyFetch<{
    products: {
      edges: Array<{
        node: {
          title: string;
          metafields: ({ key: string; value: string | null } | null)[];
        };
      }>;
    };
  }>({
    query: getNavProductsQuery,
    tags: ['nav-products'],
  });

  return res.body.products.edges.map((e) => ({
    title: e.node.title,
    metafields: (e.node.metafields ?? []).filter(
      (m): m is { key: string; value: string | null } => m !== null
    ),
  }));
}

export async function createCart(): Promise<Cart> {
    const res = await shopifyFetch<{ cartCreate: { cart: Cart } }>({
        query: createCartMutation,
        variables: {},
        cache: 'no-store',
    });
    return res.body.cartCreate.cart;
}

export async function createCheckoutCart(
    variantId: string,
    quantity: number,
    customerAccessToken?: string,
    email?: string
): Promise<{ id: string; checkoutUrl: string }> {
    const variables = {
        lines: [{ merchandiseId: variantId, quantity }],
        ...(customerAccessToken ? {
            buyerIdentity: { customerAccessToken, email }
        } : {})
    };

    const res = await shopifyFetch<{
        cartCreate: {
            cart: { id: string; checkoutUrl: string };
            userErrors: { field: string; message: string }[];
        };
    }>({
        query: createCheckoutCartMutation,
        variables,
        cache: 'no-store',
    });

    const userErrors = res.body.cartCreate?.userErrors;
    if (userErrors && userErrors.length > 0) {
        throw new Error(userErrors[0].message);
    }

    return res.body.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
    const res = await shopifyFetch<{ cart: Cart }>({
        query: getCartQuery,
        variables: { cartId },
        tags: ['cart'],
        cache: 'no-store',
    });
    return res.body.cart;
}

export async function addToCart(
    cartId: string,
    lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
    const res = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>({
        query: addToCartMutation,
        variables: {
            cartId,
            lines,
        },
        cache: 'no-store',
    });
    return res.body.cartLinesAdd.cart;
}

export async function removeFromCart(
    cartId: string,
    lineIds: string[]
): Promise<Cart> {
    const res = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>({
        query: removeFromCartMutation,
        variables: {
            cartId,
            lineIds,
        },
        cache: 'no-store',
    });
    return res.body.cartLinesRemove.cart;
}

export async function updateCart(
    cartId: string,
    lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
    const res = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>({
        query: editCartLinesMutation,
        variables: {
            cartId,
            lines,
        },
        cache: 'no-store',
    });
    return res.body.cartLinesUpdate.cart;
}

export async function updateCartBuyerIdentity(cartId: string, customerAccessToken: string) {
    const res = await shopifyFetch<{
        cartBuyerIdentityUpdate: {
            cart: Cart;
            userErrors: { field: string; message: string }[];
        };
    }>({
        query: updateCartBuyerIdentityMutation,
        variables: {
            cartId,
            buyerIdentity: {
                customerAccessToken,
            },
        },
        cache: 'no-store',
    });
    return res.body.cartBuyerIdentityUpdate.cart;
}

// --- Auth Functions ---

export async function createCustomerAccessToken(email: string, password: string) {
    const res = await shopifyFetch<{
        customerAccessTokenCreate: {
            customerAccessToken: { accessToken: string; expiresAt: string };
            customerUserErrors: { code: string; field: string; message: string }[];
        };
    }>({
        query: customerAccessTokenCreateMutation,
        variables: { email, password },
        cache: 'no-store',
    });

    return res.body.customerAccessTokenCreate;
}

export async function deleteCustomerAccessToken(customerAccessToken: string) {
    const res = await shopifyFetch<{
        customerAccessTokenDelete: {
            deletedAccessToken: string;
            deletedCustomerAccessTokenId: string;
            userErrors: { field: string; message: string }[];
        };
    }>({
        query: customerAccessTokenDeleteMutation,
        variables: { customerAccessToken },
        cache: 'no-store',
    });
    return res.body.customerAccessTokenDelete;
}

export async function createCustomer(data: any) {
    const res = await shopifyFetch<{
        customerCreate: {
            customer: any;
            customerUserErrors: { code: string; field: string; message: string }[];
        };
    }>({
        query: customerCreateMutation,
        variables: data,
        cache: 'no-store',
    });
    return res.body.customerCreate;
}

export async function getCustomer(customerAccessToken: string) {
    const res = await shopifyFetch<{ customer: any }>({
        query: getCustomerQuery,
        variables: { customerAccessToken },
        cache: 'no-store',
    });
    return res.body.customer;
}

export async function recoverCustomer(email: string) {
    const res = await shopifyFetch<{
        customerRecover: {
            customerUserErrors: { code: string; field: string; message: string }[];
        };
    }>({
        query: customerRecoverMutation,
        variables: { email },
        cache: 'no-store',
    });
    return res.body.customerRecover;
}

export async function resetCustomer(id: string, input: any) {
    const res = await shopifyFetch<{
        customerReset: {
            customer: any;
            customerUserErrors: { code: string; field: string; message: string }[];
        };
    }>({
        query: customerResetMutation,
        variables: { id, input },
        cache: 'no-store',
    });
    return res.body.customerReset;
}

export async function updateCustomer(customerAccessToken: string, customer: { firstName?: string; lastName?: string; phone?: string }) {
    const res = await shopifyFetch<{
        customerUpdate: {
            customer: any;
            customerUserErrors: { code: string; field: string; message: string }[];
        };
    }>({
        query: customerUpdateMutation,
        variables: { customerAccessToken, customer },
        cache: 'no-store',
    });
    return res.body.customerUpdate;
}

export async function createCustomerAddress(customerAccessToken: string, address: any) {
    const res = await shopifyFetch<{
        customerAddressCreate: {
            customerAddress: { id: string } | null;
            customerUserErrors: { code: string; field: string; message: string }[];
        };
    }>({
        query: customerAddressCreateMutation,
        variables: { customerAccessToken, address },
        cache: 'no-store',
    });
    return res.body.customerAddressCreate;
}

export async function updateCustomerAddress(customerAccessToken: string, id: string, address: any) {
    const res = await shopifyFetch<{
        customerAddressUpdate: {
            customerAddress: { id: string } | null;
            customerUserErrors: { code: string; field: string; message: string }[];
        };
    }>({
        query: customerAddressUpdateMutation,
        variables: { customerAccessToken, id, address },
        cache: 'no-store',
    });
    return res.body.customerAddressUpdate;
}

export async function deleteCustomerAddress(customerAccessToken: string, id: string) {
    const res = await shopifyFetch<{
        customerAddressDelete: {
            deletedCustomerAddressId: string;
            customerUserErrors: { code: string; field: string; message: string }[];
        };
    }>({
        query: customerAddressDeleteMutation,
        variables: { customerAccessToken, id },
        cache: 'no-store',
    });
    return res.body.customerAddressDelete;
}

export async function setDefaultCustomerAddress(customerAccessToken: string, addressId: string) {
    const res = await shopifyFetch<{
        customerDefaultAddressUpdate: {
            customer: any;
            customerUserErrors: { code: string; field: string; message: string }[];
        };
    }>({
        query: customerDefaultAddressUpdateMutation,
        variables: { customerAccessToken, addressId },
        cache: 'no-store',
    });
    return res.body.customerDefaultAddressUpdate;
}