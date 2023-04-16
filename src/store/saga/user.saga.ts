import { call, put, takeLeading } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { UserServiceUpdatePassword } from '@services/user.service';
import { setIsPasswordUpdateError, setIsPasswordUpdating } from '@slice/user.slice';
import { OauthServiceResponse } from '../types';

function* updatePassword(action: PayloadAction<{ uid: string; password: string }>) {
    const { uid, password } = action.payload;
    yield put(setIsPasswordUpdating(true));
    const data: OauthServiceResponse = yield call(UserServiceUpdatePassword, uid, password);

    yield put(setIsPasswordUpdating(false));

    if (!data) {
        yield put(setIsPasswordUpdateError('Server error'));
    } else if (data.status === 'error') {
        yield put(setIsPasswordUpdateError(data.message));
    }
}

export function* SagaUserUpdatePassword() {
    yield takeLeading(USER_UPDATE_PASSWORD, updatePassword);
}

export const USER_UPDATE_PASSWORD = 'user/update_password';
