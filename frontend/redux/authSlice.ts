import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AuthState {
    value: boolean
}

const initialState: AuthState = {
    value: false,
}

// Create the slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state) => {
            state.value = true
        },
        logout: (state) => {
            state.value = false
        }
    }
})

export const authStatus = (state: RootState) => state.auth.value
export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer