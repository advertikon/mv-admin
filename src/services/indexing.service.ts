import { authFetchApi } from '../modules/oauth/ouath';
import { ProductIndexStatus } from '../types';

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
