import CollectionsClient from './CollectionsClient';

export interface Collection {
    id: string;
    title: string;
    subtitle: string;
    handle: string;
    image: string;
    overlay: string;
    size: 'large' | 'small';
    ctaText: string;
}

const COLLECTIONS: Collection[] = [
    {
        id: '1',
        title: 'Wedding Collection',
        subtitle: 'Timeless gold pieces for your special day.',
        handle: 'wedding-collection',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
        overlay: 'from-rose-200/90 via-rose-100/40 to-transparent',
        size: 'large',
        ctaText: 'Explore Collection',
    },
    {
        id: '2',
        title: 'Everyday Elegance',
        subtitle: 'Everyday luxury for the modern woman.',
        handle: 'everyday-elegance',
        image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=800',
        overlay: 'from-emerald-100/90 via-emerald-50/40 to-transparent',
        size: 'small',
        ctaText: 'Shop Now',
    },
    {
        id: '3',
        title: 'Statement Party',
        subtitle: 'Bold designs that command attention.',
        handle: 'statement-party',
        image: 'https://images.unsplash.com/photo-1535633302704-b02f4fad253f?auto=format&fit=crop&q=80&w=800',
        overlay: 'from-orange-100/90 via-orange-50/40 to-transparent',
        size: 'small',
        ctaText: 'Shop Now',
    },
];

export default function CollectionsServer() {
    const large = COLLECTIONS.find((c) => c.size === 'large')!;
    const small = COLLECTIONS.filter((c) => c.size === 'small');

    return (
        <CollectionsClient
            large={large}
            small={small}
        />
    );
}