import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Auth } from '../../types';
import { RootState } from '../store';
import { OauthInit } from '../../modules/oauth/ouath';

type State = {
    auth: Auth;
    isLoading: boolean;
    exchangeCodeError: Error | null;
};

OauthInit({
    oauthServiceUrl: process.env.NEXT_PUBLIC_OAUTH_SERVER,
    redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL,
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

const initialState: State = {
    auth: {
        sub: null,
        uid: null,
        active: false,
        company: null,
        permissions: [],
        login: '',
        roles: [],
    },
    isLoading: false,
    exchangeCodeError: null,
};

const slice = createSlice({
    name: 'oauth',
    initialState,
    reducers: {
        setAuth: (state, data: PayloadAction<Auth>) => {
            state.auth = { ...initialState.auth, ...(data.payload ?? {}) };
        },
        setIsLoading: (state, data: PayloadAction<boolean>) => {
            state.isLoading = data.payload;
        },
        setExchangeCodeError: (state, data: PayloadAction<Error>) => {
            state.exchangeCodeError = data.payload;
        },
    },
});

export const { setAuth, setIsLoading, setExchangeCodeError } = slice.actions;

export const getCompany = (state: RootState) => state.auth.auth?.company;
export const getPermissions = (state: RootState) => state.auth.auth?.permissions;
export const getAuthUid = (state: RootState) => state.auth.auth?.uid;
export const getLogin = (state: RootState) => state.auth.auth?.login;
export const isAdmin = (status: RootState) =>
    status.auth.auth?.roles?.includes('shop_admin') || status.auth?.auth?.roles.includes('super_admin');
export const isSuperAdmin = (status: RootState) => status.auth.auth?.roles?.includes('super_admin');
export const isLoading = (status: RootState) => status.auth?.isLoading;
export const exchangeCodeError = (status: RootState) => status.auth?.exchangeCodeError;
export const isLoggedIn = (status: RootState) => Boolean(status.auth.auth?.uid);
export const getAuth = (status: RootState) => status.auth;

export default slice.reducer;
