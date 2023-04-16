import { authFetchApi } from '@modules/oauth/ouath';
import { OauthServiceResponse } from '../store/types';

const backEndUrl = process.env.NEXT_PUBLIC_OAUTH_SERVER;

export async function UserServiceUpdatePassword(uid: string, password: string): Promise<OauthServiceResponse> {
    return authFetchApi(`${backEndUrl}/user/${uid}/password`, {
        method: 'patch',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
    });
}
