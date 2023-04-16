import { authFetchApi } from '@modules/oauth/ouath';

const backEndUrl = process.env.NEXT_PUBLIC_BACK_END;

export async function ConfigServiceGetOne<T>(key: string): Promise<T> {
    const resp = await authFetchApi(`${backEndUrl}/api/config/get-one`, {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key }),
    });

    return resp?.value;
}

export async function ConfigServiceSetOne<T>(key: string, value: T): Promise<T> {
    const resp = await authFetchApi(`${backEndUrl}/api/config/set-one`, {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key, value }),
    });

    return resp?.value;
}

export async function ConfigServiceCheckApiKey(key: string): Promise<boolean> {
    const resp = await authFetchApi(`${backEndUrl}/api/config/check-key`, {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key }),
    });

    return resp?.value;
}
