import { authFetchApi } from '../modules/oauth/ouath';
import { ProductIndexStatus, ProductSyncStatus } from '../types';

const backEndUrl = process.env.NEXT_PUBLIC_BACK_END;

export async function ServiceIndexingStatus(): Promise<ProductIndexStatus> {
    return authFetchApi(`${backEndUrl}/api/product/index/status`);
}

export async function ServiceIndexingStart(): Promise<ProductIndexStatus> {
    return authFetchApi(`${backEndUrl}/api/product/index?anew=true`);
}

export async function ServiceIndexingResume(): Promise<ProductIndexStatus> {
    return authFetchApi(`${backEndUrl}/api/product/index`);
}

export async function ServiceIndexingStop(): Promise<ProductIndexStatus> {
    return authFetchApi(`${backEndUrl}/api/product/index/stop`);
}

export async function ServiceIndexingSync(): Promise<{ status: 'ok' }> {
    return authFetchApi(`${backEndUrl}/api/product/index/sync`);
}

export async function ServiceIndexingSyncStatus(): Promise<ProductSyncStatus> {
    return authFetchApi(`${backEndUrl}/api/product/index/sync/status`);
}
