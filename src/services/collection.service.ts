import { authFetchApi } from '../modules/oauth/ouath';
import { GetCollectionsFilter } from '../store/types';

export async function CollectionServiceGetAll(filter: GetCollectionsFilter): Promise<string> {
    const query = Object.entries(filter)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    const resp = await authFetchApi(`${process.env.NEXT_PUBLIC_BACK_END}/api/collection?${query}`);
    return resp?.collections;
}
