export type Auth = {
    sub: string | null;
    uid: string | null;
    active: boolean;
    company: string | null;
    permissions: string[];
    login: string;
    roles: string[];
};

export type WebhookTopic =
    | 'products/update'
    | 'products/create'
    | 'products/delete'
    | 'collections/create'
    | 'collections/update'
    | 'collections/delete';

export type ProductIndexStatus = {
    isActive: boolean;
    isStuck: boolean;
    isCancelled: boolean;
    lastRun: number;
    lastRunString: string;
    processedProductsCount: number;
    indexBunchSize: number;
    indexDelay: number;
    totalProductsCount: number;
    indexedProductsCount: number;
};

export type ProductSyncStatus = {
    status: boolean;
    total?: number;
    processed?: number;
    deleted?: number;
    required?: boolean;
};
