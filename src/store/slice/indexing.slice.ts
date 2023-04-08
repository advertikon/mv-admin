import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductIndexStatus } from '../../types';
import { RootState } from '../store';

type IndexingStat = {
    status: ProductIndexStatus;
    isLoading: boolean;
    isStopping: boolean;
    isStarting: boolean;
    isResuming: boolean;
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
    },
});

export const {
    setIndexingStatus,
    setIsIndexingLoading,
    setIsIndexingStarting,
    setIsIndexingStopping,
    setIsIndexingResuming,
} = slice.actions;

export const getIndexingStatus = (state: RootState) => state.indexing.status;
export const getIsIndexingLoading = (state: RootState) => state.indexing.isLoading;
export const getIsIndexingStarting = (state: RootState) => state.indexing.isStarting;
export const getIsIndexingStopping = (state: RootState) => state.indexing.isStopping;
export const getIsIndexingResuming = (state: RootState) => state.indexing.isResuming;

export default slice.reducer;
