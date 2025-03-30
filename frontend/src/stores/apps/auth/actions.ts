import {createAsyncThunk} from "@reduxjs/toolkit";
import {registerAuth, updateAuthMe} from "src/services/auth";

export const registerAuthAsync = createAsyncThunk(
    'auth/register',
    async (data: any) => {
        const response = await registerAuth(data)
        return response.status
    }
)

export const updateAuthMeAsync = createAsyncThunk(
    'auth/authMe',
    async (data: any) => {
        const response = await updateAuthMe(data)
        console.log("response", response)
        return response.status
    }
)