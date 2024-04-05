import { QueryClient } from '@tanstack/react-query';
import { addShopifyMutations } from './mutations/shopify.mutation';
import { addShopifyQueries } from './queries/shopify.queries';
import { processResponse } from '../../utils/query';

export enum Queries {
    SHOPIFY_GET_PRODUCT_STAT = 'shopify/getProductStat',
    SHOPIFY_GET_CATEGORIES_STAT = 'shopify/getCategoriesStat',
    SHOPIFY_GET_CATEGORIES_LIST = 'shopify/getCategoriesList',
    FOO = 'foo',
}

export enum Mutations {
    FOO = 'foo',
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

addShopifyQueries(queryClient);
