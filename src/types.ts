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

export type ShopifyCategoryStat = {
    freeCount: number;
    freeSum: number;
    paidCount: number;
    paidSum: number;
    stdDev: number;
    name: string;
    avgFree: string | number;
    avgPaid: string | number;
};

export type ShopifyProductStat = {
    _id: string;
    url: string;
    developer: string;
    name: string;
    created_at: string;
    last_visit: string;
    has_new_content: boolean;
    categories: string[];
    has_new_stats: boolean;
    avgReviews: number;
    past2MonthReviews: number;
    past3MonthReviews: number;
    pastMonthReviews: number;
    stats: {
        _id: string;
        rating: number;
        reviews: number;
        date: string;
        product_id: string;
        price?: string;
        pricing_plans?: string[];
    }[];
};
