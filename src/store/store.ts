import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { RootSaga } from '@saga/root.saga';
import oauthReducer from './slice/oauth.slice';
import configReducer from './slice/config.slice';
import collectionsReducer from './slice/collection.slice';
import webhooksReducer from './slice/webhook.slice';
import indexingReducer from './slice/indexing.slice';
import vehicleReducer from './slice/vehicle.slice';
import userReducer from './slice/user.slice';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        auth: oauthReducer,
        config: configReducer,
        collections: collectionsReducer,
        webhooks: webhooksReducer,
        indexing: indexingReducer,
        vehicle: vehicleReducer,
        user: userReducer,
    },
    middleware: [sagaMiddleware],
});

sagaMiddleware.run(RootSaga);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
