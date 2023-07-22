import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductIndexStatus, ProductSyncStatus } from '../../types';
import { RootState } from '../store';

type IndexingStat = {
    status: ProductIndexStatus;
    isLoading: boolean;
    isStopping: boolean;
    isStarting: boolean;
    isResuming: boolean;
    sync: ProductSyncStatus;
    isSyncStarting: boolean;
    isSyncStatusLoading: boolean;
    syncError: string;
    syncStatusError: string;
};

const initialState: IndexingStat = {
    status: {
        isActive: false,
        isStuck: false,
        isCancelled: false,
        lastRun: 0,
        lastRunString: '',
        processedProductsCount: 0,
        indexBunchSize: 0,
        indexDelay: 0,
        totalProductsCount: 0,
        indexedProductsCount: 0,
    },
    isLoading: false,
    isStopping: false,
    isStarting: false,
    isResuming: false,
    sync: {
        status: false,
        total: 0,
        processed: 0,
        deleted: 0,
        required: false,
    },
    isSyncStarting: false,
    isSyncStatusLoading: false,
    syncError: '',
    syncStatusError: '',
};

const slice = createSlice({
    name: 'indexing',
    initialState,
    reducers: {
        setIndexingStatus: (state, data: PayloadAction<ProductIndexStatus>) => {
            if (data.payload) {
                state.status = data.payload;
            }
        },
        setIsIndexingLoading: (state, data: PayloadAction<boolean>) => {
            state.isLoading = data.payload;
        },
        setIsIndexingStarting: (state, data: PayloadAction<boolean>) => {
            state.isStarting = data.payload;
        },
        setIsIndexingStopping: (state, data: PayloadAction<boolean>) => {
            state.isStopping = data.payload;
        },
        setIsIndexingResuming: (state, data: PayloadAction<boolean>) => {
            state.isResuming = data.payload;
        },
        setSyncStatus: (state, data: PayloadAction<ProductSyncStatus>) => {
            if (data.payload?.status !== undefined) {
                state.sync = data.payload;
            }
        },
        setSyncStarting: (state, data: PayloadAction<boolean>) => {
            state.isSyncStarting = data.payload;
        },
        setSyncError: (state, data: PayloadAction<string>) => {
            state.syncError = data.payload;
        },
        setSyncStatusLoading: (state, data: PayloadAction<boolean>) => {
            state.isSyncStatusLoading = data.payload;
        },
        setSyncStatusError: (state, data: PayloadAction<string>) => {
            state.syncStatusError = data.payload;
        },
    },
});

export const {
    setIndexingStatus,
    setIsIndexingLoading,
    setIsIndexingStarting,
    setIsIndexingStopping,
    setIsIndexingResuming,
    setSyncStarting,
    setSyncStatus,
    setSyncError,
    setSyncStatusError,
    setSyncStatusLoading,
} = slice.actions;

export const getIndexingStatus = (state: RootState) => state.indexing.status;
export const getIsIndexingLoading = (state: RootState) => state.indexing.isLoading;
export const getIsIndexingStarting = (state: RootState) => state.indexing.isStarting;
export const getIsIndexingStopping = (state: RootState) => state.indexing.isStopping;
export const getIsIndexingResuming = (state: RootState) => state.indexing.isResuming;
export const getSyncStatus = (state: RootState) => state.indexing.sync;
export const getSyncIsStarting = (state: RootState) => state.indexing.isSyncStarting;
export const getSyncError = (state: RootState) => state.indexing.syncError;
export const getSyncStatusIsLoading = (state: RootState) => state.indexing.isSyncStatusLoading;
export const getSyncStatusError = (state: RootState) => state.indexing.syncStatusError;

export default slice.reducer;
