import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            return action.payload;
        },
        logout: () => null,
        update: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

// Action creators are generated for each case reducer function
const userReducer = userSlice.reducer;
const userActions = userSlice.actions;

export default userReducer;
export { userActions };
