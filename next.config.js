/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.shopify.com',
                pathname: '/s/files/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.shopify.com',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            }
        ],
    },
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|bmp|gif)',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                ],
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/password',
                destination: '/',
                permanent: true,
            },
            {
                source: '/collections',
                destination: '/silver-jewellery',
                permanent: true,
            },
            {
                source: '/collections/all',
                destination: '/silver-jewellery',
                permanent: true,
            },
            {
                source: '/collections/:path*',
                destination: '/silver-jewellery/:path*',
                permanent: true,
            },
            {
                source: '/products/:path*',
                destination: '/silver-jewellery/all/:path*',
                permanent: true,
            }
        ];
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
