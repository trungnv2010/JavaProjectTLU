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

// Định nghĩa rõ ràng hơn cho kiểu dữ liệu người dùng
interface User {
    id: number | null
    email: string | null
    firstName: string | null
    lastName: string | null
    role: string | null
    phone: string | null
    city: string | null
    // Thêm các trường khác nếu cần
}

interface UserState {
    data: Array<User>
    total: number
    params: DataParams | {}
    allData: Array<User>
    loading: boolean
    error: any
}

// ** Fetch Users
export const fetchData = createAsyncThunk(
    'appUsers/fetchData',
    async (params: DataParams) => {
        const response = await axios.get('/apps/users/list', {
            params
        })

        return response.data
    }
)

// ** Add User
export const addUser = createAsyncThunk(
    'appUsers/addUser',
    async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
        const response = await axios.post('/apps/users/add-user', {
            data
        })
        dispatch(fetchData(getState().user.params))

        return response.data
    }
)

// ** Get All Users
export const getAllUserAsync = createAsyncThunk(
    'appUsers/getAllUsers',
    async (data: { body: TPagination }) => {
        try {
            const response = await getAllUser(data)
            // Đảm bảo response có cấu trúc đúng
            if (!response.data) {
                return { data: [], totalItems: 0 }
            }

            // Đảm bảo mỗi người dùng có dữ liệu hợp lệ
            const validatedData = (response.data || []).map((user: any) => ({
                id: user?.id || null,
                email: user?.email || null,
                firstName: user?.firstName || null,
                lastName: user?.lastName || null,
                role: user?.role || null,
                phone: user?.phone || null,
                city: user?.city || null
                // Thêm các trường khác nếu cần
            }))

            return {
                data: validatedData,
                totalItems: response.totalItems || 0
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            throw error
        }
    }
)

export const createUserAsync = createAsyncThunk(
    'appUsers/createUser',
    async (data: { body: TUserData }) => {
        try {
            const response = await createNewUser(data)
            // Sau khi tạo người dùng thành công, lấy lại danh sách
            dispatch(getAllUserAsync({ body: { page: 0, size: 0 } }))
            return response
        } catch (error) {
            console.error('Error creating user:', error)
            throw error
        }
    }
)

export const updateUserAsync = createAsyncThunk(
    'appUsers/updateUser',
    async (data: { body: TUserData }, { dispatch }) => {
        try {
            const response = await updateUser(data)
            // Sau khi cập nhật người dùng thành công, lấy lại danh sách
            dispatch(getAllUserAsync({ body: { page: 0, size: 10 } }))
            return response
        } catch (error) {
            console.error('Error updating user:', error)
            throw error
        }
    }
)

export const deleteUserAsync = createAsyncThunk(
    'appUsers/deleteUser',
    async (id: number, { dispatch }) => {
        try {
            const response = await deleteUser(id)
            // Sau khi xóa người dùng thành công, lấy lại danh sách
            dispatch(getAllUserAsync({ body: { page: 0, size: 10 } }))
            return response
        } catch (error) {
            console.error('Error deleting user:', error)
            throw error
        }
    }
)

const initialState: UserState = {
    data: [],
    total: 1,
    params: {},
    allData: [],
    loading: false,
    error: null
}

export const appUsersSlice = createSlice({
    name: 'appUsers',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null
        },
        resetInitialState: () => {
            return initialState
        }
    },
    extraReducers: builder => {
        // fetchData reducers
        builder.addCase(fetchData.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.data = action.payload.users || []
            state.total = action.payload.total || 0
            state.params = action.payload.params || {}
            state.allData = action.payload.allData || []
            state.loading = false
            state.error = null
        })
        builder.addCase(fetchData.rejected, (state, action) => {
            state.loading = false
            state.error = action.error
        })

        // getAllUserAsync reducers
        builder.addCase(getAllUserAsync.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAllUserAsync.fulfilled, (state, action) => {
            // Đảm bảo dữ liệu không bao giờ là undefined/null
            state.allData = action.payload.data || []
            state.total = action.payload.totalItems || 0
            state.loading = false
            state.error = null
        })
        builder.addCase(getAllUserAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error
            // Không reset dữ liệu hiện có khi có lỗi
        })

        // createUserAsync reducers
        builder.addCase(createUserAsync.pending, (state) => {
            state.loading = true
        })
        builder.addCase(createUserAsync.fulfilled, (state) => {
            state.loading = false
            state.error = null
        })
        builder.addCase(createUserAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error
        })

        // updateUserAsync reducers
        builder.addCase(updateUserAsync.pending, (state) => {
            state.loading = true
        })
        builder.addCase(updateUserAsync.fulfilled, (state) => {
            state.loading = false
            state.error = null
        })
        builder.addCase(updateUserAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error
        })

        // deleteUserAsync reducers
        builder.addCase(deleteUserAsync.pending, (state) => {
            state.loading = true
        })
        builder.addCase(deleteUserAsync.fulfilled, (state) => {
            state.loading = false
            state.error = null
        })
        builder.addCase(deleteUserAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error
        })
    }
})

export const { clearErrors, resetInitialState } = appUsersSlice.actions

export default appUsersSlice.reducer