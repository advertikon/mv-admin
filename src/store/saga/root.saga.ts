import { all } from 'redux-saga/effects';
import { SagaUserUpdatePassword } from '@saga/user.saga';
import { SagaAuthExchangeCode, SagaAuthGetMe, SagaAuthLogout } from './oauth.saga';

export function* RootSaga() {
    yield all([SagaAuthGetMe(), SagaAuthExchangeCode(), SagaUserUpdatePassword(), SagaAuthLogout()]);
}
