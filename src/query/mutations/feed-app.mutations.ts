import { QueryClient } from '@tanstack/react-query';
import { Mutations } from '../query-client';
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

function sendMessage({ text, shops, type }: { text: string; shops: string; type: string }) {
    return fetch(`${HOST}/api/admin/message`, {
        method: 'post',
        body: JSON.stringify({
            text,
            shops,
            type,
        }),
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    }).then(processResponse);
}

export function addFeedAppMutations(queryClient: QueryClient) {
    queryClient.setMutationDefaults([Mutations.FEED_APP_SEND_MESSAGE], {
        mutationFn: sendMessage,
    });
}
