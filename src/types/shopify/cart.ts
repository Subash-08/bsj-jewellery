import type { Connection, Image, Money } from './image';
import type { ProductVariant } from './product';

export type CartLine = {
    id: string;
    quantity: number;
    cost: {
        totalAmount: Money;
    };
    merchandise: {
        id: string;
        title: string;
        selectedOptions: {
            name: string;
            value: string;
        }[];
        product: {
            id: string;
            handle: string;
            title: string;
            featuredImage: Image;
        };
    };
};

export type Cart = {
    id: string;
    checkoutUrl: string;
    cost: {
        subtotalAmount: Money;
        totalAmount: Money;
        totalTaxAmount: Money;
    };
    lines: Connection<CartLine>;
    totalQuantity: number;
};