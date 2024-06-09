import { QueryClient } from '@tanstack/react-query';
import { Mutations, Queries } from '../query-client';
import { processResponse } from '../../utils/query';

const HOST = process.env.NEXT_PUBLIC_SHOPIFY_STATS_HOST;

function syncProduct(productId: string) {
    return fetch(`${HOST}/product/${productId}/refetch`, {
        method: 'get',
    }).then(processResponse);
}

export function addShopifyMutations(queryClient: QueryClient) {
    queryClient.setMutationDefaults([Mutations.SYNC_PRODUCT], {
        mutationFn: syncProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [Queries.SHOPIFY_GET_PRODUCT_STAT] });
        },
    });
}
