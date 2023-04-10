import { call, debounce, put, takeLeading } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { CollectionServiceGetAll } from '../../services/collection.service';
import { setCollections, setCollectionsIsLoading } from '../slice/collection.slice';
import { CollectionsState, GetCollectionsFilter } from '../types';

function* fetchCollections(action: PayloadAction<GetCollectionsFilter>) {
    yield put(setCollectionsIsLoading(true));
    const data: CollectionsState = yield call(CollectionServiceGetAll, action.payload);
    yield put(setCollections(data));
    yield put(setCollectionsIsLoading(false));
}

export function* SagaGetCollections() {
    yield takeLeading(GET_COLLECTIONS, fetchCollections);
}

export function* SagaGetCollectionsAutocomplete() {
    yield debounce(500, GET_COLLECTIONS_AUTOCOMPLETE, fetchCollections);
}

export const GET_COLLECTIONS = 'collections/get';
export const GET_COLLECTIONS_AUTOCOMPLETE = 'collections/get_autocomplete';
