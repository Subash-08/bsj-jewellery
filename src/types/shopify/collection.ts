import type { Connection, Image } from './image';
import type { Product } from './product';

export type Collection = {
    handle: string;
    title: string;
    description: string;
    seo: {
        title: string;
        description: string;
    };
    updatedAt: string;
    path: string;
    image?: Image;
    products: Connection<Product>;
};