import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type State = {
    passwordIsUpdating: boolean;
    passwordUpdateError: string;
};

const initialState: State = {
    passwordIsUpdating: false,
    passwordUpdateError: '',
};

const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setIsPasswordUpdating: (state, data: PayloadAction<boolean>) => {
            state.passwordIsUpdating = data.payload;
        },
        setIsPasswordUpdateError: (state, data: PayloadAction<string>) => {
            state.passwordUpdateError = data.payload;
        },
    },
});

export const { setIsPasswordUpdating, setIsPasswordUpdateError } = slice.actions;

export const isPasswordUpdating = (state: RootState) => state.user.passwordIsUpdating;
export const passwordUpdateError = (state: RootState) => state.user.passwordUpdateError;

export default slice.reducer;
