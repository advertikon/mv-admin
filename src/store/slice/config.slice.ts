import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Collection } from '../types';

type Config = {
    filterableCollections: Collection[];
    isFilterableCollectionsLoading: boolean;
    apiKey: string;
    isApiKeyLoading: boolean;
    apiKeyError: string;
    shopName: string;
    skuTemplate: string;
    isSkuTemplateLoading: boolean;
    vehicleStack: string[];
    isVehicleStackLoading: boolean;
};

const initialState: Config = {
    filterableCollections: [],
    isFilterableCollectionsLoading: false,
    apiKey: '',
    isApiKeyLoading: false,
    apiKeyError: '',
    shopName: '',
    skuTemplate: '',
    isSkuTemplateLoading: false,
    vehicleStack: [],
    isVehicleStackLoading: false,
};

const slice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setFilterableCollections: (state, data: PayloadAction<Collection[]>) => {
            state.filterableCollections = data.payload ?? [];
        },
        setIsFilterableCollectionsLoading: (state, data: PayloadAction<boolean>) => {
            state.isFilterableCollectionsLoading = data.payload;
        },
        setApiKey: (state, data: PayloadAction<string>) => {
            state.apiKey = data.payload ?? '';
        },
        setIsApiKeyLoading: (state, data: PayloadAction<boolean>) => {
            state.isApiKeyLoading = data.payload;
        },
        setApiKeyError: (state, data: PayloadAction<string>) => {
            state.apiKeyError = data.payload ?? '';
        },
        setShopName: (state, data: PayloadAction<string>) => {
            state.shopName = data.payload ?? '';
        },
        setSkuTemplate: (state, data: PayloadAction<string>) => {
            state.skuTemplate = data.payload ?? '';
        },
        setIsSkuTemplateLoading: (state, data: PayloadAction<boolean>) => {
            state.isSkuTemplateLoading = data.payload;
        },
        setVehicleStack: (state, data: PayloadAction<string[]>) => {
            state.vehicleStack = data.payload;
        },
        setIsVehicleStackLoading: (state, data: PayloadAction<boolean>) => {
            state.isVehicleStackLoading = data.payload;
        },
    },
});

export const {
    setFilterableCollections,
    setIsFilterableCollectionsLoading,
    setApiKey,
    setApiKeyError,
    setShopName,
    setIsApiKeyLoading,
    setSkuTemplate,
    setIsSkuTemplateLoading,
    setVehicleStack,
    setIsVehicleStackLoading,
} = slice.actions;

export const getFilterableCollections = (state: RootState): Collection[] => state.config.filterableCollections;
export const getIsFilterableCollectionsLoading = (state: RootState): boolean =>
    state.config.isFilterableCollectionsLoading;
export const getApiKey = (state: RootState): string => state.config.apiKey;
export const getIsApiKeyLoading = (state: RootState): boolean => state.config.isApiKeyLoading;
export const getApiKeyError = (state: RootState): string => state.config.apiKeyError;
export const getShopName = (state: RootState): string => state.config.shopName;
export const getSkuTemplate = (state: RootState): string => state.config.skuTemplate;
export const getIsSkuTemplateLoading = (state: RootState): boolean => state.config.isSkuTemplateLoading;
export const getVehicleStack = (state: RootState): string[] => state.config.vehicleStack;
export const getIsVehicleStackLoading = (state: RootState): boolean => state.config.isVehicleStackLoading;

export default slice.reducer;
