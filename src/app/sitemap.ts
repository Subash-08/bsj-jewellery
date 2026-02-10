import { getSitemapData } from '@/lib/seo/sitemap-generator';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = [
        {
            url: process.env.NEXT_PUBLIC_SITE_URL || '',
            lastModified: new Date(),
        },
    ];

    const dynamicRoutes = await getSitemapData();

    return [...staticRoutes, ...dynamicRoutes];
}