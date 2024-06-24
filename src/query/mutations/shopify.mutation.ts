import { QueryClient } from '@tanstack/react-query';
import { Mutations, Queries } from '../query-client';
import { processResponse } from '../../utils/query';

const HOST = process.env.NEXT_PUBLIC_SHOPIFY_STATS_HOST;

function syncProduct(productId: string) {
    return fetch(`${HOST}/product/${productId}/refetch`, {
        method: 'get',
    }).then(processResponse);
}

function setKeywordsList(list: string[]) {
    return fetch(`${HOST}/keyword/keywords`, {
        method: 'post',
        body: JSON.stringify({ keywords: list }),
    }).then(processResponse);
}

function setAppHandlersList(list: string[]) {
    return fetch(`${HOST}/keyword/handlers`, {
        method: 'post',
        body: JSON.stringify({ appHandlers: list }),
    }).then(processResponse);
}

export function addShopifyMutations(queryClient: QueryClient) {
    queryClient.setMutationDefaults([Mutations.SYNC_PRODUCT], {
        mutationFn: syncProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [Queries.SHOPIFY_GET_PRODUCT_STAT] });
        },
    });

    queryClient.setMutationDefaults([Mutations.SHOPIFY_SET_KEYWORDS_LIST], {
        mutationFn: setKeywordsList,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [Queries.SHOPIFY_GET_KEYWORDS_LIST] });
        },
    });

    queryClient.setMutationDefaults([Mutations.SHOPIFY_SET_APP_HANDLERS_LIST], {
        mutationFn: setAppHandlersList,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [Queries.SHOPIFY_GET_APP_HANDLERS_LIST] });
        },
    });
}
