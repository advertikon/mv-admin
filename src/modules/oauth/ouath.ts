import logger from '../logger/logger';
import { Auth } from '../../types';
import { RefreshTokenError } from '../../error/refresh-token.error';

type OauthContext = {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    oauthServiceUrl: string;
};

type TokenData = {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expires_at: number;
};

type AuthHeaders = {
    authorization: string;
};

const REF_PAGE = 'page_before_auth';
let context: OauthContext;
let oauthPage = '';
export function OauthInit(oauthContext: OauthContext) {
    context = oauthContext;
    oauthPage = `${context.oauthServiceUrl}/oauth/auth?client_id=${context.clientId}&response_type=code&scope=openid user_info&redirect_uri=${context.redirectUrl}`;
}

export function RedirectToLoginPage(): void {
    window.localStorage.setItem(REF_PAGE, window.location.href);
    window.location.assign(oauthPage);
}

export async function exchangeCode(code: string) {
    const data = {
        client_id: context.clientId,
        client_secret: context.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: context.redirectUrl,
    };

    return fetch(`${context.oauthServiceUrl}/oauth/token`, {
        body: encodeFormData(data),
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
    })
        .then(resp => {
            if (!resp.ok) {
                throw new Error(`Failed to exchange auth token: ${resp.statusText}`);
            }
            return resp.json();
        })
        .then(resp => {
            setToken(resp);
            redirectToPageBeforeAuth();
        })
        .catch(error => {
            logger.error(error);
            throw error;
        });
}

export async function refreshToken(): Promise<void> {
    const token = getToken();
    console.log('refresh token');
    console.log(token);
    if (!token?.refresh_token) {
        throw new RefreshTokenError('Refresh token missing');
    }

    const data = {
        client_id: context.clientId,
        client_secret: context.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token,
    };

    await fetch(`${context.oauthServiceUrl}/oauth/token`, {
        body: encodeFormData(data),
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
    })
        .then(resp => {
            if (resp.ok) {
                return resp.json();
            }
            throw new RefreshTokenError(`Failed to refresh auth token: ${resp.statusText}`);
        })
        .then(resp => {
            setToken(resp);
        });
}

export async function me(): Promise<Auth> {
    return authFetch(`${context.oauthServiceUrl}/oauth/me`);
}

function getToken(): TokenData | null {
    const tokenJSON = window.localStorage.getItem('token');

    if (tokenJSON) {
        return JSON.parse(tokenJSON);
    }

    RedirectToLoginPage();
    return null;
}

async function getAccessToken(): Promise<string | null> {
    let token = getToken();

    if (token) {
        if (new Date(token.expires_at - 5000) < new Date()) {
            await refreshToken();
            token = getToken();
        }

        if (!token?.access_token) {
            logger.error('Cannot get access token. Token data missing access_token string');
            return null;
        }

        return token.access_token;
    }

    return null;
}

function encodeFormData(data: { [key: string]: string }): string {
    return Object.entries(data)
        .map(([k, v]) => {
            return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
        })
        .join('&');
}

function setToken(data: TokenData) {
    data.expires_at = new Date().getTime() + data.expires_in * 1000;
    window.localStorage.setItem('token', JSON.stringify(data));
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<any> {
    return innerAuthFetch(url, options).catch(() => {
        RedirectToLoginPage();
    });
}

export async function authFetchApi(url: string, options: RequestInit = {}): Promise<any> {
    return innerAuthFetch(url, options).catch();
}

async function innerAuthFetch(url: string, options: RequestInit = {}): Promise<any> {
    let attempts = 0;
    const doFetch = async (): Promise<any> => {
        attempts += 1;
        options.headers = { ...(options.headers || {}), ...(await getHeaders()) };

        return fetch(url, options)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

                if (res.status === 401 && attempts <= 3) {
                    return refreshToken().then(() => doFetch());
                }
                logger.error(`Error fetching url ${url}: ${res.statusText} (${res.status})`);
                return null;
            })
            .catch(error => {
                if (error.constructor?.name === RefreshTokenError.name) {
                    throw error;
                }
                logger.error(`Error fetching ${url}: ${error.message}`);
            });
    };

    return doFetch();
}

async function getHeaders(headers: Partial<AuthHeaders> = {}): Promise<AuthHeaders> {
    const token = await getAccessToken();
    headers.authorization = `Bearer ${token}`;
    return headers as AuthHeaders;
}

function redirectToPageBeforeAuth() {
    const doNotRedirectRegexps = [/oauth\/token\/exchange/];
    const refPage = window.localStorage.getItem(REF_PAGE);
    const returnPage = refPage && !doNotRedirectRegexps.find(r => r.test(refPage)) ? refPage : '/';
    window.location.assign(returnPage);
}
