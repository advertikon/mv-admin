import { QueryClient } from '@tanstack/react-query';
import { addShopifyMutations } from './mutations/shopify.mutation';
import { addShopifyQueries } from './queries/shopify.queries';
import { processResponse } from '../utils/query';
import { addFeedAppMutations } from './mutations/feed-app.mutations';
import { addFeeAppQueries } from './queries/feed-app.query';

export enum Queries {
    SHOPIFY_GET_PRODUCT_STAT = 'shopify/getProductStat',
    SHOPIFY_GET_CATEGORIES_STAT = 'shopify/getCategoriesStat',
    SHOPIFY_GET_CATEGORIES_LIST = 'shopify/getCategoriesList',
    SHOPIFY_GET_KEYWORDS_LIST = 'shopify/getKeywordsList',
    SHOPIFY_GET_APP_HANDLERS_LIST = 'shopify/getAppHandlersList',
    SHOPIFY_GET_KEYWORDS_STATS_LATEST = 'shopify/getKeywordsStatsLatest',
    SHOPIFY_GET_KEYWORDS_STATS_HISTORY = 'shopify/getKeywordsStatsHistory',
    SHOPIFY_EXTRACT_KEYWORDS = 'shopify/extractKeywords',
    FEED_APP_SEARCH_SHOP = 'feedApp/searchShop',
}

export enum Mutations {
    SYNC_PRODUCT = 'shopify/syncProduct',
    SHOPIFY_SET_KEYWORDS_LIST = 'shopify/setKeywordsList',
    SHOPIFY_SET_APP_HANDLERS_LIST = 'shopify/setAppHandlersList',
    SHOPIFY_REFETCH_KEYWORDS = 'shopify/refetchKeywords',
    FEED_APP_SEND_MESSAGE = 'feedApp/sendMessage',
}

const defaultQueryFn = async ({ queryKey }: { queryKey: string[] }) => {
    return fetch(queryKey[0]).then(processResponse);
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: defaultQueryFn as any,
            retry: false,
            staleTime: 1000 * 60 * 60 * 24,
        },
        mutations: {
            retry: false,
        },
    },
});

addShopifyMutations(queryClient);
addFeedAppMutations(queryClient);

addShopifyQueries(queryClient);
addFeeAppQueries(queryClient);
