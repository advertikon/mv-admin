import { call, put, takeLeading } from 'redux-saga/effects';
import {
    ServiceIndexingResume,
    ServiceIndexingStart,
    ServiceIndexingStatus,
    ServiceIndexingStop,
    ServiceIndexingSync,
    ServiceIndexingSyncStatus,
} from '@services/indexing.service';
import {
    setIndexingStatus,
    setIsIndexingLoading,
    setIsIndexingStarting,
    setIsIndexingStopping,
    setIsIndexingResuming,
    setSyncStarting,
    setSyncStatusLoading,
    setSyncStatus,
    setSyncError,
} from '@slice/indexing.slice';
import { ProductIndexStatus } from '../../types';

function* fetchIndexingStatus() {
    yield put(setIsIndexingLoading(true));
    const data: ProductIndexStatus = yield call(ServiceIndexingStatus);
    yield put(setIndexingStatus(data));
    yield put(setIsIndexingLoading(false));
}

function* startIndexing() {
    yield put(setIsIndexingStarting(true));
    yield call(ServiceIndexingStart);
    const data: ProductIndexStatus = yield call(ServiceIndexingStatus);
    yield put(setIndexingStatus(data));
    yield put(setIsIndexingStarting(false));
}

function* resumeIndexing() {
    yield put(setIsIndexingResuming(true));
    yield call(ServiceIndexingResume);
    const data: ProductIndexStatus = yield call(ServiceIndexingStatus);
    yield put(setIndexingStatus(data));
    yield put(setIsIndexingResuming(false));
}

function* stopIndexing() {
    yield put(setIsIndexingStopping(true));
    yield call(ServiceIndexingStop);
    const data: ProductIndexStatus = yield call(ServiceIndexingStatus);
    yield put(setIndexingStatus(data));
    yield put(setIsIndexingStopping(false));
}

function* startSync() {
    yield put(setSyncStarting(true));
    const data = yield call(ServiceIndexingSync);
    if (data.status !== 'ok') {
        yield put(setSyncError('Start Sync Error'));
    }
    yield put(setSyncStarting(false));
}

function* getSyncStatus() {
    yield put(setSyncStatusLoading(true));
    const data = yield call(ServiceIndexingSyncStatus);
    yield put(setSyncStatus(data));
    yield put(setSyncStatusLoading(false));
}

export function* SagaIndexingGetIndexingStatus() {
    yield takeLeading(INDEXING_GET_STATUS, fetchIndexingStatus);
}

export function* SagaIndexingGetIndexingStart() {
    yield takeLeading(INDEXING_START, startIndexing);
}

export function* SagaIndexingGetIndexingResume() {
    yield takeLeading(INDEXING_RESUME, resumeIndexing);
}

export function* SagaIndexingGetIndexingStop() {
    yield takeLeading(INDEXING_STOP, stopIndexing);
}

export function* SagaIndexingStartSync() {
    yield takeLeading(SYNC_START, startSync);
}

export function* SagaIndexingSyncStatus() {
    yield takeLeading(SYNC_STATUS, getSyncStatus);
}

export const INDEXING_GET_STATUS = 'indexing/get_status';
export const INDEXING_START = 'indexing/start';
export const INDEXING_STOP = 'indexing/stop';
export const INDEXING_RESUME = 'indexing/resume';
export const SYNC_START = 'sync/start';
export const SYNC_STATUS = 'sync/status';
