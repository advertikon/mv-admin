import { call, put, takeLeading } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { exchangeCode, me } from '../../modules/oauth/ouath';
import { setAuth } from '../slice/oauth.slice';
import { Auth } from '../../types';

let exchangeCodeRun = 0;

function* fetchMe() {
    const auth: Auth = yield call(me);
    yield put(setAuth(auth));
}

function* exchangeCodeSage(action: PayloadAction<string>) {
    if (exchangeCodeRun === 0) {
        yield call(exchangeCode, action.payload);
    }

    exchangeCodeRun += 1;
}

export function* SagaAuthGetMe() {
    yield takeLeading(AUTH_GET_ME, fetchMe);
}

export function* SagaAuthExchangeCode() {
    yield takeLeading(AUTH_DO_EXCHANGE_CODE, exchangeCodeSage);
}

export const AUTH_GET_ME = 'oauth/get_me';
export const AUTH_DO_EXCHANGE_CODE = 'oauth/do_exchange_code';
