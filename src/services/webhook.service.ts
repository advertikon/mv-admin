import { authFetchApi } from '../modules/oauth/ouath';
import { Webhook } from '../store/slice/webhook.slice';
import { WebhookTopic } from '../types';

const backEndUrl = process.env.NEXT_PUBLIC_BACK_END;

export async function WebhookServiceGet(): Promise<Webhook[]> {
    return authFetchApi(`${backEndUrl}/api/webhooks`);
}

export async function WebhookServiceCreate(topic: WebhookTopic): Promise<Webhook[]> {
    return authFetchApi(`${backEndUrl}/api/webhooks`, {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic }),
    });
}

export async function WebhookServiceDelete(topic: WebhookTopic): Promise<void> {
    await authFetchApi(`${backEndUrl}/api/webhooks?topic=${topic}`, { method: 'delete' });
}
