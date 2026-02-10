import type { Metadata } from 'next';

type Props = {
    title: string;
    description: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
};

export function generateSeo({ title, description, image, type = 'website' }: Props): Metadata {
    // Next.js's Metadata type for OpenGraph.type does not include 'product'.
    // If 'product' is passed, we cast it to 'website' or another valid OpenGraphType.
    // Alternatively, we could map 'product' to a more specific OpenGraph type if applicable,
    // but for simplicity, we'll default to 'website' if 'product' is used.
    const openGraphType = type === 'product' ? 'website' : type;

    return {
        title,
        description,
        openGraph: {
            type: openGraphType,
            title,
            description,
            ...(image && {
                images: [
                    {
                        url: image,
                    },
                ],
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            ...(image && {
                images: [image],
            }),
        },
    };
}