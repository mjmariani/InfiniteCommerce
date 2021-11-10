import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name:"user", 
    initialState:{
        user:null
    },
    reducers:{
        loginState: (state, action) => {
            state.user = action.payload;
        },
        logoutState: (state) => {
            state.user = null;
        },
        shoppingCartState: (state, action) => {
            state.cart = action.payload;
        }
    },
});

export const {loginState, logoutState, shoppingCartState} = userSlice.actions;

export const selectUser = (state) => state.user.user;

export const selectCart = (state) => state.cart.user;

export default userSlice.reducer;