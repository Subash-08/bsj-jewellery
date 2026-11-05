const originalEnv = process.env;

function loadResolver(checkoutDomain?: string) {
    jest.resetModules();
    process.env = {
        ...originalEnv,
        SHOPIFY_CHECKOUT_DOMAIN: checkoutDomain,
    };
    return import('@/lib/shopify/checkout');
}

describe('resolveCheckoutUrl', () => {
    afterAll(() => {
        process.env = originalEnv;
    });

    it('rejects a checkout URL that points back to the storefront', async () => {
        const { CheckoutConfigurationError, resolveCheckoutUrl } = await loadResolver();

        expect(() =>
            resolveCheckoutUrl('https://bakya.in/cart/c/token?key=secret', 'www.bakya.in')
        ).toThrow(CheckoutConfigurationError);
    });

    it('uses the configured Shopify checkout domain and preserves the path and query', async () => {
        const { resolveCheckoutUrl } = await loadResolver('checkout.bakya.in');

        expect(
            resolveCheckoutUrl('https://bakya.in/cart/c/token?key=secret', 'www.bakya.in')
        ).toBe('https://checkout.bakya.in/cart/c/token?key=secret');
    });

    it('preserves a checkout URL already hosted away from the storefront', async () => {
        const { resolveCheckoutUrl } = await loadResolver();

        expect(
            resolveCheckoutUrl(
                'https://shop.example.myshopify.com/cart/c/token?key=secret',
                'www.bakya.in'
            )
        ).toBe('https://shop.example.myshopify.com/cart/c/token?key=secret');
    });
});
