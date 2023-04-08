import { call, put, takeLeading, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigServiceCheckApiKey, ConfigServiceGetOne, ConfigServiceSetOne } from '../../services/config.service';
import {
    setApiKey,
    setApiKeyError,
    setFilterableCollections,
    setIsApiKeyLoading,
    setIsFilterableCollectionsLoading,
    setIsSkuTemplateLoading,
    setIsVehicleStackLoading,
    setSkuTemplate,
    setVehicleStack,
} from '../slice/config.slice';
import { CONFIG } from '../../enums';
import { Collection } from '../slice/collection.slice';

function* fetchFilterableCollections() {
    yield put(setIsFilterableCollectionsLoading(true));
    const data: Collection[] = yield call(ConfigServiceGetOne, CONFIG.FILTERABLE_COLLECTIONS);
    yield put(setFilterableCollections(data || []));
    yield put(setIsFilterableCollectionsLoading(false));
}

function* setFilterableCollection(action: PayloadAction<string>) {
    yield put(setIsFilterableCollectionsLoading(true));
    const data: Collection[] = yield call(ConfigServiceSetOne, CONFIG.FILTERABLE_COLLECTIONS, action.payload);
    yield put(setFilterableCollections(data || []));
    yield put(setIsFilterableCollectionsLoading(false));
}

function* SagaPutApiKey(action: PayloadAction<string>) {
    yield put(setIsApiKeyLoading(true));
    yield put(setApiKeyError(''));
    const isValid: boolean = yield call(ConfigServiceCheckApiKey, action.payload);

    if (isValid) {
        const key: string = yield call(ConfigServiceSetOne, CONFIG.API_KEY, action.payload);
        yield put(setApiKey(key));
    } else {
        yield put(setApiKeyError('API key is invalid'));
    }

    yield put(setIsApiKeyLoading(false));
}

function* SagaFetchApiKey() {
    yield put(setIsApiKeyLoading(true));
    const data: string = yield call(ConfigServiceGetOne, CONFIG.API_KEY);
    yield put(setApiKey(data));
    yield put(setIsApiKeyLoading(false));
}

function* SagaFetchSkuTemplate() {
    yield put(setIsSkuTemplateLoading(true));
    const data: string = yield call(ConfigServiceGetOne, CONFIG.SKU_TEMPLATE);
    yield put(setSkuTemplate(data ?? ''));
    yield put(setIsSkuTemplateLoading(false));
}

function* SageSetSkuTemplate(action: PayloadAction<string>) {
    yield put(setIsSkuTemplateLoading(true));
    const data: string = yield call(ConfigServiceSetOne, CONFIG.SKU_TEMPLATE, action.payload);
    yield put(setSkuTemplate(data ?? ''));
    yield put(setIsSkuTemplateLoading(false));
}

function* SagaFetchVehicleStack() {
    yield put(setIsVehicleStackLoading(true));
    const data: string[] = yield call(ConfigServiceGetOne, CONFIG.VEHICLE_STACK);
    yield put(setVehicleStack(data || []));
    yield put(setIsVehicleStackLoading(false));
}

function* SageSetVehicleStack(action: PayloadAction<string[]>) {
    yield put(setIsVehicleStackLoading(true));
    const data: string[] = yield call(ConfigServiceSetOne, CONFIG.VEHICLE_STACK, action.payload);
    yield put(setVehicleStack(data || []));
    yield put(setIsVehicleStackLoading(false));
}

export function* SagaConfigGetFilterableCollections() {
    yield takeLeading(CONFIG_GET_FILTERABLE_COLLECTIONS, fetchFilterableCollections);
}

export function* SagaConfigSetFilterableCollections() {
    yield takeLeading(CONFIG_ADD_FILTERABLE_COLLECTIONS, setFilterableCollection);
}

export function* SagaConfigGetApiKey() {
    yield takeLeading(CONFIG_GET_API_KEY, SagaFetchApiKey);
}

export function* SagaConfigSetApiKey() {
    yield takeLeading(CONFIG_SET_API_KEY, SagaPutApiKey);
}

export function* SagaConfigGetSkuTemplate() {
    yield takeLeading(CONFIG_GET_SKU_TEMPLATE, SagaFetchSkuTemplate);
}

export function* SagaConfigSetSkuTemplate() {
    yield takeLeading(CONFIG_SET_SKU_TEMPLATE, SageSetSkuTemplate);
}

export function* SagaConfigGetVehicleStack() {
    yield takeLeading(CONFIG_GET_VEHICLE_STACK, SagaFetchVehicleStack);
}

export function* SagaConfigSetVehicleStack() {
    yield takeLatest(CONFIG_SET_VEHICLE_STACK, SageSetVehicleStack);
}

export const CONFIG_GET_FILTERABLE_COLLECTIONS = 'config/get_filterable_collections';
export const CONFIG_ADD_FILTERABLE_COLLECTIONS = 'config/add_filterable_collections';
export const CONFIG_GET_API_KEY = 'config/get_api_key';
export const CONFIG_SET_API_KEY = 'config/set_api_key';
export const CONFIG_GET_SKU_TEMPLATE = 'config/get_sku_template';
export const CONFIG_SET_SKU_TEMPLATE = 'config/set_sku_template';
export const CONFIG_SET_VEHICLE_STACK = 'config/set_vehicle_stack';
export const CONFIG_GET_VEHICLE_STACK = 'config/get_vehicle_stack';
