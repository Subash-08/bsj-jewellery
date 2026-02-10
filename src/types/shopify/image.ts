export type Money = {
    amount: string;
    currencyCode: string;
};

export type Image = {
    url: string;
    altText: string;
    width: number;
    height: number;
};

export type Connection<T> = {
    edges: Array<{
        node: T;
    }>;
};