import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AuthState {
    value: string
}

const initialState: AuthState = {
    value: localStorage.getItem('access_token') || '',
}

// Create the slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.value = action.payload
            localStorage.setItem('access_token', action.payload)
        },
        logout: (state) => {
            state.value = ''
            localStorage.clear()
        }
    }
})

export const authStatus = (state: RootState) => state.auth.value
export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer