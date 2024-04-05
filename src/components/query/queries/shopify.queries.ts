/* eslint-disable no-console */
import { QueryClient, QueryKey } from '@tanstack/react-query';
import { Queries } from '../query-client';
import { makeQueryString, processResponse } from '../../../utils/query';

const HOST = process.env.NEXT_PUBLIC_SHOPIFY_STATS_HOST;

function GetProductStats({ queryKey }: { queryKey: QueryKey }) {
    const [, category, id] = queryKey;

    return fetch(`${HOST}/products-stats?${makeQueryString({ category })}`, {
        method: 'get',
    })
        .then(processResponse)
        .catch(console.log);
}

function GetCategoriesList() {
    return fetch(`${HOST}/categories-list`, {
        method: 'get',
    })
        .then(processResponse)
        .catch(console.log);
}

function GetCategoriesStats() {
    return fetch(`${HOST}/categories-stats`, {
        method: 'get',
    })
        .then(processResponse)
        .catch(console.log);
}

export function addShopifyQueries(queryClient: QueryClient) {
    queryClient.setQueryDefaults([Queries.SHOPIFY_GET_PRODUCT_STAT], {
        queryFn: GetProductStats,
    });

    queryClient.setQueryDefaults([Queries.SHOPIFY_GET_CATEGORIES_LIST], {
        queryFn: GetCategoriesList,
    });

    queryClient.setQueryDefaults([Queries.SHOPIFY_GET_CATEGORIES_STAT], {
        queryFn: GetCategoriesStats,
    });
}
