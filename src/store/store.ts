import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { RootSaga } from '@saga/root.saga';
import oauthReducer from './slice/oauth.slice';
import userReducer from './slice/user.slice';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        auth: oauthReducer,
        user: userReducer,
    },
    middleware: [sagaMiddleware],
});

sagaMiddleware.run(RootSaga);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
