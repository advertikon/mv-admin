export async function processResponse<T>(response: Response, defaultValue?: T): Promise<T | never> {
    const body = await getBody<T & { error?: string }>(response);

    if (response.ok) {
        return body;
    }

    if (response.status === 401) {
        // eslint-disable-next-line no-console
        console.error('Authentication error', body);
    } else {
        // eslint-disable-next-line no-console
        console.error('Server error', body);
    }

    if (defaultValue) {
        return defaultValue;
    }

    throw new Error(body.error || response.statusText);
}

export async function getBody<T>(response: Response): Promise<T> {
    return response.headers.get('Content-Type')?.includes('application/json')
        ? response.json()
        : (response.text() as any);
}

export function makeQueryString(query: Record<string, any>, asArray = true) {
    return Object.entries(query)
        .filter(([, value]) => value !== undefined && (Array.isArray(value) ? value.length > 0 : true))
        .flatMap(([key, value]) => {
            if (Array.isArray(value)) {
                if (asArray) {
                    return value.map(v => `${key}[]=${encodeURIComponent(v)}`);
                }

                return `${key}=${value.map(encodeURIComponent).join(',')}`;
            }

            return `${key}=${value}`;
        })
        .join('&');
}
