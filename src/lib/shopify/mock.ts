import type { Product } from '@/types/shopify/product';

export const mockProducts: Product[] = [
    {
        id: 'gid://shopify/Product/1',
        handle: 'diamond-ring',
        title: 'Diamond Ring',
        description: 'A beautiful diamond ring.',
        descriptionHtml: '<p>A beautiful diamond ring.</p>',
        productType: 'Ring',
        tags: ['Ring', 'Diamond'],
        availableForSale: true,
        collections: { edges: [{ node: { handle: 'rings' } }] },
        options: [
            {
                id: 'opt1',
                name: 'Title',
                values: ['Default Title']
            }
        ],
        priceRange: {
            maxVariantPrice: { amount: '1000.00', currencyCode: 'USD' },
            minVariantPrice: { amount: '1000.00', currencyCode: 'USD' },
        },
        metafields: [],
        images: [
            {
                id: 'img1',
                url: 'https://placehold.co/600x600/png?text=Diamond+Ring',
                altText: 'Diamond Ring',
                width: 600,
                height: 600,
            },
        ],
        featuredImage: {
            id: 'img1',
            url: 'https://placehold.co/600x600/png?text=Diamond+Ring',
            altText: 'Diamond Ring',
            width: 600,
            height: 600,
        },
        variants: [
            {
                id: 'gid://shopify/ProductVariant/1',
                title: 'Default Title',
                sku: 'DR-001',
                availableForSale: true,
                price: { amount: '1000.00', currencyCode: 'USD' },
                compareAtPrice: null,
                selectedOptions: [{ name: 'Title', value: 'Default Title' }],
            },
        ],
        seo: { title: 'Diamond Ring', description: 'A beautiful diamond ring.' },
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'gid://shopify/Product/2',
        handle: 'gold-necklace',
        title: 'Gold Necklace',
        description: 'A shiny gold necklace.',
        descriptionHtml: '<p>A shiny gold necklace.</p>',
        productType: 'Necklace',
        tags: ['Necklace', 'Gold'],
        availableForSale: true,
        collections: { edges: [{ node: { handle: 'necklaces' } }] },
        options: [
            {
                id: 'opt2',
                name: 'Title',
                values: ['Default Title']
            }
        ],
        priceRange: {
            maxVariantPrice: { amount: '500.00', currencyCode: 'USD' },
            minVariantPrice: { amount: '500.00', currencyCode: 'USD' },
        },
        metafields: [],
        images: [
            {
                id: 'img2',
                url: 'https://placehold.co/600x600/png?text=Gold+Necklace',
                altText: 'Gold Necklace',
                width: 600,
                height: 600,
            },
        ],
        featuredImage: {
            id: 'img2',
            url: 'https://placehold.co/600x600/png?text=Gold+Necklace',
            altText: 'Gold Necklace',
            width: 600,
            height: 600,
        },
        variants: [
            {
                id: 'gid://shopify/ProductVariant/2',
                title: 'Default Title',
                sku: 'GN-001',
                availableForSale: true,
                price: { amount: '500.00', currencyCode: 'USD' },
                compareAtPrice: null,
                selectedOptions: [{ name: 'Title', value: 'Default Title' }],
            },
        ],
        seo: { title: 'Gold Necklace', description: 'A shiny gold necklace.' },
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'gid://shopify/Product/3',
        handle: 'silver-bracelet',
        title: 'Silver Bracelet',
        description: 'An elegant silver bracelet.',
        descriptionHtml: '<p>An elegant silver bracelet.</p>',
        productType: 'Bracelet',
        tags: ['Bracelet', 'Silver'],
        availableForSale: true,
        collections: { edges: [{ node: { handle: 'bracelets' } }] },
        options: [
            {
                id: 'opt3',
                name: 'Title',
                values: ['Default Title']
            }
        ],
        priceRange: {
            maxVariantPrice: { amount: '150.00', currencyCode: 'USD' },
            minVariantPrice: { amount: '150.00', currencyCode: 'USD' },
        },
        metafields: [],
        images: [
            {
                id: 'img3',
                url: 'https://placehold.co/600x600/png?text=Silver+Bracelet',
                altText: 'Silver Bracelet',
                width: 600,
                height: 600,
            },
        ],
        featuredImage: {
            id: 'img3',
            url: 'https://placehold.co/600x600/png?text=Silver+Bracelet',
            altText: 'Silver Bracelet',
            width: 600,
            height: 600,
        },
        variants: [
            {
                id: 'gid://shopify/ProductVariant/3',
                title: 'Default Title',
                sku: 'SB-001',
                availableForSale: true,
                price: { amount: '150.00', currencyCode: 'USD' },
                compareAtPrice: null,
                selectedOptions: [{ name: 'Title', value: 'Default Title' }],
            },
        ],
        seo: { title: 'Silver Bracelet', description: 'An elegant silver bracelet.' },
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'gid://shopify/Product/4',
        handle: 'pearl-earrings',
        title: 'Pearl Earrings',
        description: 'Classic pearl earrings.',
        descriptionHtml: '<p>Classic pearl earrings.</p>',
        productType: 'Earrings',
        tags: ['Earrings', 'Pearl'],
        availableForSale: true,
        collections: { edges: [{ node: { handle: 'earrings' } }] },
        options: [
            {
                id: 'opt4',
                name: 'Title',
                values: ['Default Title']
            }
        ],
        priceRange: {
            maxVariantPrice: { amount: '300.00', currencyCode: 'USD' },
            minVariantPrice: { amount: '300.00', currencyCode: 'USD' },
        },
        metafields: [],
        images: [
            {
                id: 'img4',
                url: 'https://placehold.co/600x600/png?text=Pearl+Earrings',
                altText: 'Pearl Earrings',
                width: 600,
                height: 600,
            },
        ],
        featuredImage: {
            id: 'img4',
            url: 'https://placehold.co/600x600/png?text=Pearl+Earrings',
            altText: 'Pearl Earrings',
            width: 600,
            height: 600,
        },
        variants: [
            {
                id: 'gid://shopify/ProductVariant/4',
                title: 'Default Title',
                sku: 'PE-001',
                availableForSale: true,
                price: { amount: '300.00', currencyCode: 'USD' },
                compareAtPrice: null,
                selectedOptions: [{ name: 'Title', value: 'Default Title' }],
            },
        ],
        seo: { title: 'Pearl Earrings', description: 'Classic pearl earrings.' },
        updatedAt: new Date().toISOString(),
    },
];
