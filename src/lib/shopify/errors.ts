export class ShopifyError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = 'ShopifyError';
    }
}

export class ShopifyValidationError extends ShopifyError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'ShopifyValidationError';
    }
}

export class ShopifyRateLimitError extends ShopifyError {
    constructor(message: string = 'Rate limit exceeded') {
        super(message, 429);
        this.name = 'ShopifyRateLimitError';
    }
}

export class ShopifyNetworkError extends ShopifyError {
    constructor(message: string) {
        super(message, 500);
        this.name = 'ShopifyNetworkError';
    }
}

export type ShopifyUserError = {
    code?: string;
    field?: string[];
    message: string;
};

export function isShopifyError(error: unknown): error is ShopifyError {
    return error instanceof ShopifyError;
}