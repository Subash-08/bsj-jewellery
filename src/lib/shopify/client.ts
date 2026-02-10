import { shopifyFetch } from './fetch';
import {
    createCartMutation,
    addToCartMutation,
    removeFromCartMutation,
    editCartLinesMutation,
    updateCartBuyerIdentityMutation,
} from './mutations';
import {
    customerAccessTokenCreateMutation,
    customerAccessTokenDeleteMutation,
    customerCreateMutation,
    customerRecoverMutation,
    customerResetMutation
} from './auth-mutations';
import {
    getProductQuery,
    getProductsQuery,
    getCollectionQuery,
    getCollectionsQuery,
    getCartQuery,
    getCustomerQuery,
} from './queries';
import type { Product } from '@/types/shopify/product';
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
}: {
    sortKey?: string;
    reverse?: boolean;
    query?: string;
} = {}): Promise<Product[]> {
    const res = await shopifyFetch<{
        products: Connection<Product>;
    }>({
        query: getProductsQuery,
        variables: { sortKey, reverse, query },
        tags: ['products'],
        cache: 'force-cache',
    });
    const rawProducts = res.body.products.edges.map((edge) => edge.node);
    return rawProducts
        .map(reshapeProduct)
        .filter((p): p is Product => p !== undefined);
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
    const res = await shopifyFetch<{ collection: Collection }>({
        query: getCollectionQuery,
        variables: { handle },
        tags: [`collections-${handle}`],
        cache: 'force-cache',
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

export async function getCollections(): Promise<Collection[]> {
    const res = await shopifyFetch<{
        collections: Connection<Collection>;
    }>({
        query: getCollectionsQuery,
        tags: ['collections'],
        cache: 'force-cache',
    });
    return res.body.collections.edges.map((edge) => edge.node);
}

export async function createCart(): Promise<Cart> {
    const res = await shopifyFetch<{ cartCreate: { cart: Cart } }>({
        query: createCartMutation,
        variables: {},
        cache: 'no-store',
    });
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