import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type VehicleState = {
    stacks: string[];
    isStacksLoading: boolean;
};

const initialState: VehicleState = {
    stacks: [],
    isStacksLoading: false,
};

const slice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        setVehicleStacks: (state, data: PayloadAction<string[]>) => {
            state.stacks = data.payload;
        },
        setIsVehicleStacksLoading: (state, data: PayloadAction<boolean>) => {
            state.isStacksLoading = data.payload;
        },
    },
});

export const { setVehicleStacks, setIsVehicleStacksLoading } = slice.actions;

export const getAvailableVehicleStacks = (state: RootState) => state.vehicle.stacks;
export const getIsAvailableVehicleStacksLoading = (state: RootState) => state.vehicle.isStacksLoading;

export default slice.reducer;
