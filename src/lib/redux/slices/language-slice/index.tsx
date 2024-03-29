/* Core */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/* Instruments */

const initialState: languageSliceState = {
    type: 'en',
};

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        switch: (state, action: PayloadAction<language>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.type = action.payload;
        },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
});

/* Types */
export type language = 'vi' | 'en';
export const languages = ['vi', 'en'];
export interface languageSliceState {
    type: language;
}
export * from './selector';
