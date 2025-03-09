/* eslint-disable no-console */
import { QueryClient, QueryKey } from '@tanstack/react-query';
import { Queries } from '../query-client';
import { makeQueryString, processResponse } from '../../utils/query';

const HOST = process.env.NEXT_PUBLIC_SHOPIFY_STATS_HOST;

function GetProductStats({ queryKey }: { queryKey: QueryKey }) {
    const [, queryParams = []] = queryKey;
    const [category, filter, search] = queryParams as string[];

    return fetch(`${HOST}/products-stats?${makeQueryString({ category, filter, search })}`, {
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

function GetKeywordsList() {
    return fetch(`${HOST}/keyword/keywords`, {
        method: 'get',
    })
        .then(processResponse)
        .catch(console.log);
}

function GetAppHandlersList() {
    return fetch(`${HOST}/keyword/handlers`, {
        method: 'get',
    })
        .then(processResponse)
        .catch(console.log);
}

function GetLatestKeywordsStats() {
    return fetch(`${HOST}/keyword/latest`, {
        method: 'get',
    })
        .then(processResponse)
        .catch(console.log);
}

function GetKeywordsHistoryStats({ queryKey }: { queryKey: QueryKey }) {
    const [, appHandler] = queryKey;
    return fetch(`${HOST}/keyword/history?${makeQueryString({ appHandler })}`, {
        method: 'get',
    })
        .then(processResponse)
        .catch(console.log);
}

function ExtractKeywords({ queryKey }: { queryKey: QueryKey }) {
    const [, appHandler] = queryKey;
    return fetch(`${HOST}/keyword/extract?${makeQueryString({ appHandler })}`, {
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

    queryClient.setQueryDefaults([Queries.SHOPIFY_GET_KEYWORDS_LIST], {
        queryFn: GetKeywordsList,
    });

    queryClient.setQueryDefaults([Queries.SHOPIFY_GET_APP_HANDLERS_LIST], {
        queryFn: GetAppHandlersList,
    });

    queryClient.setQueryDefaults([Queries.SHOPIFY_GET_KEYWORDS_STATS_LATEST], {
        queryFn: GetLatestKeywordsStats,
    });

    queryClient.setQueryDefaults([Queries.SHOPIFY_GET_KEYWORDS_STATS_HISTORY], {
        queryFn: GetKeywordsHistoryStats,
    });

    queryClient.setQueryDefaults([Queries.SHOPIFY_EXTRACT_KEYWORDS], {
        queryFn: ExtractKeywords,
    });
}
