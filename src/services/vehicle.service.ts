import { authFetchApi } from '../modules/oauth/ouath';

const backEndUrl = process.env.NEXT_PUBLIC_BACK_END;
export function ServiceVehicleGetStack(): Promise<string[]> {
    return authFetchApi(`${backEndUrl}/api/shop/available-stacks`);
}
