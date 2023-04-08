import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Auth } from '../../types';
import { RootState } from '../store';
import { OauthInit } from '../../modules/oauth/ouath.js';

const { NEXT_PUBLIC_OAUTH_SERVER, NEXT_PUBLIC_CLIENT_ID, NEXT_PUBLIC_CLIENT_SECRET, NEXT_PUBLIC_REDIRECT_URL } =
    process.env;

OauthInit({
    oauthServiceUrl: NEXT_PUBLIC_OAUTH_SERVER,
    redirectUrl: NEXT_PUBLIC_REDIRECT_URL,
    clientId: NEXT_PUBLIC_CLIENT_ID,
    clientSecret: NEXT_PUBLIC_CLIENT_SECRET,
});

const initialState: Auth = {
    sub: null,
    uid: null,
    active: false,
    company: null,
    permissions: [],
    login: '',
    roles: [],
};

const slice = createSlice({
    name: 'oauth',
    initialState,
    reducers: {
        setAuth: (state, data: PayloadAction<Auth>) => {
            return data.payload;
        },
    },
});

export const { setAuth } = slice.actions;

export const getCompany = (state: RootState) => state.auth.company;
export const getPermissions = (state: RootState) => state.auth.permissions;
export const getAuthUid = (state: RootState) => state.auth.uid;
export const getLogin = (state: RootState) => state.auth.login;
export const canAccessAdminArea = (status: RootState) => status.auth.roles.includes('shop_admin');
export const isSuper = (status: RootState) => status.auth.roles.includes('super_admin');

export default slice.reducer;
