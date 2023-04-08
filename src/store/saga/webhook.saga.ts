import { call, put, takeLeading } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { WebhookServiceCreate, WebhookServiceDelete, WebhookServiceGet } from '../../services/webhook.service';
import { setIsWebhookLoading, setWebhooks, Webhook } from '../slice/webhook.slice';
import { WebhookTopic } from '../../types';

function* fetchWebhooksSaga() {
    yield put(setIsWebhookLoading(true));
    const data: Webhook[] = yield call(WebhookServiceGet);
    yield put(setWebhooks(data));
    yield put(setIsWebhookLoading(false));
}

function* createWebhookSage(action: PayloadAction<WebhookTopic>) {
    yield put(setIsWebhookLoading(true));
    yield call(WebhookServiceCreate, action.payload);
    const data: Webhook[] = yield call(WebhookServiceGet);
    yield put(setWebhooks(data));
    yield put(setIsWebhookLoading(false));
}

function* deleteWebhookSage(action: PayloadAction<WebhookTopic>) {
    yield put(setIsWebhookLoading(true));
    yield call(WebhookServiceDelete, action.payload);
    const data: Webhook[] = yield call(WebhookServiceGet);
    yield put(setWebhooks(data));
    yield put(setIsWebhookLoading(false));
}

export function* SagaWebhookGet() {
    yield takeLeading(WEBHOOKS_GET, fetchWebhooksSaga);
}

export function* SagaWebhookCreate() {
    yield takeLeading(WEBHOOKS_CREATE, createWebhookSage);
}

export function* SagaWebhookDelete() {
    yield takeLeading(WEBHOOKS_DELETE, deleteWebhookSage);
}

export const WEBHOOKS_GET = 'webhooks/get';
export const WEBHOOKS_CREATE = 'webhooks/create';
export const WEBHOOKS_DELETE = 'webhooks/delete';
