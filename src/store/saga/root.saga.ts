import { all } from 'redux-saga/effects';
import { SagaUserUpdatePassword } from '@saga/user.saga';
import { SagaAuthExchangeCode, SagaAuthGetMe } from './oauth.saga';
import {
    SagaConfigGetApiKey,
    SagaConfigGetFilterableCollections,
    SagaConfigGetSkuTemplate,
    SagaConfigGetVehicleStack,
    SagaConfigSetApiKey,
    SagaConfigSetFilterableCollections,
    SagaConfigSetSkuTemplate,
    SagaConfigSetVehicleStack,
} from './config.saga';
import { SagaGetCollections, SagaGetCollectionsAutocomplete } from './collection.saga';
import { SagaWebhookCreate, SagaWebhookDelete, SagaWebhookGet } from './webhook.saga';
import {
    SagaIndexingGetIndexingResume,
    SagaIndexingGetIndexingStart,
    SagaIndexingGetIndexingStatus,
    SagaIndexingGetIndexingStop,
    SagaIndexingStartSync,
    SagaIndexingSyncStatus,
} from './indexing.saga';
import { SagaVehicleGetStacks } from './vehicle.saga';

export function* RootSaga() {
    yield all([
        SagaAuthGetMe(),
        SagaAuthExchangeCode(),
        SagaConfigGetFilterableCollections(),
        SagaGetCollections(),
        SagaGetCollectionsAutocomplete(),
        SagaConfigSetFilterableCollections(),
        SagaConfigGetApiKey(),
        SagaConfigSetApiKey(),
        SagaConfigGetSkuTemplate(),
        SagaConfigSetSkuTemplate(),
        SagaWebhookGet(),
        SagaWebhookCreate(),
        SagaWebhookDelete(),
        SagaIndexingGetIndexingStatus(),
        SagaIndexingGetIndexingStart(),
        SagaIndexingGetIndexingResume(),
        SagaIndexingGetIndexingStop(),
        SagaVehicleGetStacks(),
        SagaConfigGetVehicleStack(),
        SagaConfigSetVehicleStack(),
        SagaUserUpdatePassword(),
        SagaIndexingStartSync(),
        SagaIndexingSyncStatus(),
    ]);
}
