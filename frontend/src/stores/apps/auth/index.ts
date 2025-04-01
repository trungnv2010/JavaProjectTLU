// ** Redux Imports
import {Dispatch} from 'redux'
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import {registerAuthAsync, updateAuthMeAsync} from "src/stores/apps/auth/actions";

interface DataParams {
    q: string
    role: string
    status: string
    currentPlan: string
}

interface Redux {
    getState: any
    dispatch: Dispatch<any>
}

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    status: '',
    message: '',
    isLoadingAuthMe: false,
    isSuccessAuthMe: false,
    isErrorAuthMe: false,
}


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: builder => {
        // ** register
        builder.addCase(registerAuthAsync.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = action.payload === 200
            state.isError = false
            state.status = action.payload
        })
        builder.addCase(registerAuthAsync.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = true
        })
        // // ** update me
        // builder.addCase(updateAuthMeAsync.pending, (state, action) => {
        //     state.isLoadingAuthMe = true
        // })
        // builder.addCase(updateAuthMeAsync.fulfilled, (state, action) => {
        //     console.log("action", action)
        //     state.isLoadingAuthMe = false
        //     state.isSuccessAuthMe = action.payload === 200
        //     state.isErrorAuthMe = false
        //     state.status = action.payload
        // })
        // builder.addCase(updateAuthMeAsync.rejected, (state, action) => {
        //     state.isLoadingAuthMe = false
        //     state.isSuccessAuthMe = false
        //     state.isErrorAuthMe = true
        // })
    }
})

export default authSlice.reducer
