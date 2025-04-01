// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { TPagination } from "src/types/auth"
import {createNewUser, deleteUser, getAllUser, TUserData, updateUser} from "src/services/user"

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

// More detailed definition for user data type
interface User {
    id: number | string | null
    email: string | null
    firstname: string | null
    lastname: string | null
    role: string | null
    phone: string | null
    city: string | null
    // Add other fields as needed
}

interface UserState {
    data: Array<User>
    total: number
    params: DataParams | {}
    allData: Array<User>
    loading: {
        fetchAll: boolean
        create: boolean
        update: boolean
        delete: boolean
    }
    error: {
        fetchAll: any
        create: any
        update: any
        delete: any
    }
}

// Helper function to check response status and handle errors
const handleResponse = (response: any) => {
    // Check if the response has a status field and it's not 200
    if (response.status && response.status !== 200) {
        // Extract error message or use a default
        const errorMessage = response.message || 'An error occurred';
        return Promise.reject(errorMessage);
    }
    return response;
};

// ** Fetch Users
export const fetchData = createAsyncThunk(
    'appUsers/fetchData',
    async (params: DataParams) => {
        const response = await axios.get('/apps/users/list', {
            params
        })

        return handleResponse(response.data);
    }
)

// ** Add User
export const addUser = createAsyncThunk(
    'appUsers/addUser',
    async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
        const response = await axios.post('/apps/users/add-user', {
            data
        })
        const checkedResponse = handleResponse(response.data);
        dispatch(fetchData(getState().user.params))

        return checkedResponse;
    }
)

// ** Get All Users
export const getAllUserAsync = createAsyncThunk(
    'appUsers/getAllUsers',
    async (data: TPagination) => {
        try {
            const response = await getAllUser(data)
            // Check response status
            const checkedResponse = handleResponse(response);

            // Ensure response has the correct structure
            if (!checkedResponse.data) {
                return { data: [], totalItems: 0 }
            }

            // Ensure each user has valid data
            const validatedData = (checkedResponse.data || []).map((user: any) => ({
                id: user?.id || null,
                email: user?.email || null,
                firstname: user?.firstname || null,
                lastname: user?.lastname || null,
                role: user?.role || null,
                phone: user?.phone || null,
                city: user?.city || null
                // Add other fields as needed
            }))

            return {
                data: validatedData,
                totalItems: checkedResponse.totalItems || 0
            }
        } catch (error: any) {
            console.error('Error fetching users:', error)
            throw error
        }
    }
)

export const createUserAsync = createAsyncThunk(
    'appUsers/createUser',
    async (data: TUserData, {dispatch}) => {
        try {
            const response = await createNewUser(data)
            // Check response status
            const checkedResponse = handleResponse(response);

            // After successfully creating the user, fetch the list again
            dispatch(getAllUserAsync({ page: -1, limit: -1 }))
            return checkedResponse
        } catch (error: any) {
            console.error('Error creating user:', error)
            // Return the error in a structured way
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to create user')
        }
    }
)

export const updateUserAsync = createAsyncThunk(
    'appUsers/updateUser',
    async (data: { id: string | number, [key: string]: any }, { dispatch }) => {
        try {
            const response = await updateUser(data)
            // Check response status
            const checkedResponse = handleResponse(response);

            // After successfully updating the user, fetch the list again
            dispatch(getAllUserAsync({ page: -1, limit: -1 }))
            return checkedResponse
        } catch (error: any) {
            console.error('Error updating user:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to update user')
        }
    }
)

export const deleteUserAsync = createAsyncThunk(
    'appUsers/deleteUser',
    async (id: string | number, { dispatch }) => {
        try {
            const response = await deleteUser(id)
            // Check response status
            const checkedResponse = handleResponse(response);

            // After successfully deleting the user, fetch the list again
            dispatch(getAllUserAsync({ page: -1, limit: -1 }))
            return checkedResponse
        } catch (error: any) {
            console.error('Error deleting user:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to delete user')
        }
    }
)

const initialState: UserState = {
    data: [],
    total: 1,
    params: {},
    allData: [],
    loading: {
        fetchAll: false,
        create: false,
        update: false,
        delete: false
    },
    error: {
        fetchAll: null,
        create: null,
        update: null,
        delete: null
    }
}

export const appUsersSlice = createSlice({
    name: 'appUsers',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = {
                fetchAll: null,
                create: null,
                update: null,
                delete: null
            }
        },
        resetInitialState: () => {
            return initialState
        }
    },
    extraReducers: builder => {
        // fetchData reducers
        builder.addCase(fetchData.pending, (state) => {
            state.loading.fetchAll = true
        })
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.data = action.payload.users || []
            state.total = action.payload.total || 0
            state.params = action.payload.params || {}
            state.allData = action.payload.allData || []
            state.loading.fetchAll = false
            state.error.fetchAll = null
        })
        builder.addCase(fetchData.rejected, (state, action) => {
            state.loading.fetchAll = false
            state.error.fetchAll = action.error.message || 'Failed to fetch data'
        })

        // getAllUserAsync reducers
        builder.addCase(getAllUserAsync.pending, (state) => {
            state.loading.fetchAll = true
        })
        builder.addCase(getAllUserAsync.fulfilled, (state, action) => {
            // Ensure data is never undefined/null
            state.allData = action.payload.data || []
            state.total = action.payload.totalItems || 0
            state.loading.fetchAll = false
            state.error.fetchAll = null
        })
        builder.addCase(getAllUserAsync.rejected, (state, action) => {
            state.loading.fetchAll = false
            state.error.fetchAll = action.error.message || 'Failed to fetch users'
            // Don't reset existing data when there's an error
        })

        // createUserAsync reducers
        builder.addCase(createUserAsync.pending, (state) => {
            state.loading.create = true
            state.error.create = null
        })
        builder.addCase(createUserAsync.fulfilled, (state) => {
            state.loading.create = false
            state.error.create = null
        })
        builder.addCase(createUserAsync.rejected, (state, action) => {
            state.loading.create = false
            state.error.create = action.error.message || 'Failed to create user'
        })

        // updateUserAsync reducers
        builder.addCase(updateUserAsync.pending, (state) => {
            state.loading.update = true
            state.error.update = null
        })
        builder.addCase(updateUserAsync.fulfilled, (state) => {
            state.loading.update = false
            state.error.update = null
        })
        builder.addCase(updateUserAsync.rejected, (state, action) => {
            state.loading.update = false
            state.error.update = action.error.message || 'Failed to update user'
        })

        // deleteUserAsync reducers
        builder.addCase(deleteUserAsync.pending, (state) => {
            state.loading.delete = true
            state.error.delete = null
        })
        builder.addCase(deleteUserAsync.fulfilled, (state) => {
            state.loading.delete = false
            state.error.delete = null
        })
        builder.addCase(deleteUserAsync.rejected, (state, action) => {
            state.loading.delete = false
            state.error.delete = action.error.message || 'Failed to delete user'
        })
    }
})

export const { clearErrors, resetInitialState } = appUsersSlice.actions

export default appUsersSlice.reducer