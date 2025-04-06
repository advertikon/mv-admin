import { QueryClient, QueryKey } from '@tanstack/react-query';
import { Queries } from '../query-client';
import { getBody } from '../../utils/query';

const HOST = process.env.NEXT_PUBLIC_FEED_AP_BE;
const AUTH_TOKEN = process.env.NEXT_FEED_APP_BE_ROOT_PASSWORD;

function getAuthHeader() {
    return { 'X-Shopify-Token': AUTH_TOKEN };
}

export async function processResponse<T>(response: Response): Promise<T | never> {
    const body = await getBody<T & { message?: string }>(response);

    if (response.ok) {
        return body;
    }

    throw new Error(typeof body === 'string' ? body : body.message ?? '');
}

function SearchShops({ queryKey }: { queryKey: QueryKey }) {
    const [, queryString] = queryKey;

    return fetch(`${HOST}/api/admin/search-shops`, {
        method: 'post',
        body: JSON.stringify({
            name: queryString,
        }),
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    }).then(processResponse);
}

export function addFeeAppQueries(queryClient: QueryClient) {
    queryClient.setQueryDefaults([Queries.FEED_APP_SEARCH_SHOP], {
        queryFn: SearchShops,
    });
}
