import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { WebhookTopic } from '../../types';

export type Webhook = {
    id: number;
    address: string;
    topic: WebhookTopic;
    created_at: string;
    updated_at: string;
};

type WebhookSate = {
    list: Webhook[];
    isWebhookLoading: boolean;
};

const initialState: WebhookSate = {
    list: [],
    isWebhookLoading: false,
};

const slice = createSlice({
    name: 'webhook',
    initialState,
    reducers: {
        setWebhooks: (state, data: PayloadAction<Webhook[]>) => {
            if (data.payload) {
                state.list = data.payload;
            }
        },
        setIsWebhookLoading: (state, data: PayloadAction<boolean>) => {
            state.isWebhookLoading = data.payload;
        },
    },
});

export const { setWebhooks, setIsWebhookLoading } = slice.actions;

export const getWebhooks = (state: RootState) => state.webhooks.list;
export const getIsWebhookLoading = (state: RootState) => state.webhooks.isWebhookLoading;

export default slice.reducer;
