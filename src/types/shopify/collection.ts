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

export type NavCollectionMetafield = {
  namespace: string;
  key: string;
  value: string | null;
};

export type NavCollection = {
  handle: string;
  title: string;
  image?: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  };
  metafields: (NavCollectionMetafield | null)[];
};

export type NavCategory = {
  id: string;
  name: string;
  handle: string;
  image?: NavCollection['image'];
  subCategories: string[];
  gender: string[];
  occasion: string[];
  collection: string[];
  design: string[];
};