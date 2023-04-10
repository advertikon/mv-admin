import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Collection, CollectionsState } from '../types';

const initialState: CollectionsState = {
    list: [],
    hasMore: false,
    after: null,
    isLoading: false,
};

const slice = createSlice({
    name: 'collections',
    initialState,
    reducers: {
        setCollections: (state, collections: PayloadAction<CollectionsState>) => {
            if (collections.payload) {
                return collections.payload;
            }
        },
        setCollectionsIsLoading: (state, isLoading: PayloadAction<boolean>) => {
            state.isLoading = isLoading.payload;
        },
    },
});

export const getCollections = (state: RootState): Collection[] => state.collections.list;
export const getCollectionsIsLoading = (state: RootState): boolean => state.collections.isLoading;

export const { setCollections, setCollectionsIsLoading } = slice.actions;

export default slice.reducer;
