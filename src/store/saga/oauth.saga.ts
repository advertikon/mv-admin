import { call, put, takeLeading } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { exchangeCode, me } from '../../modules/oauth/ouath';
import { setAuth, setExchangeCodeError, setIsLoading } from '../slice/oauth.slice';
import { Auth } from '../../types';

function* fetchMe() {
    yield put(setIsLoading(true));
    const auth: Auth = yield call(me);
    yield put(setAuth(auth));
    yield put(setIsLoading(false));
}

function* exchangeCodeSage(action: PayloadAction<string>) {
    try {
        yield call(exchangeCode, action.payload);
    } catch (e) {
        yield put(setExchangeCodeError(e));
    }
}

export function* SagaAuthGetMe() {
    yield takeLeading(AUTH_GET_ME, fetchMe);
}

export function* SagaAuthExchangeCode() {
    yield takeLeading(AUTH_DO_EXCHANGE_CODE, exchangeCodeSage);
}

export const AUTH_GET_ME = 'oauth/get_me';
export const AUTH_DO_EXCHANGE_CODE = 'oauth/do_exchange_code';
