// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { TPagination } from "src/types/auth"

import { createNewCategory, deleteCategory, getAllCategories, TCategoryData, updateCategory } from "src/services/category"

interface DataParams {
    q: string
    page: number
    limit: number
}

interface Redux {
    getState: any
    dispatch: Dispatch<any>
}

interface Category {
    id: number | string | null
    name: string | null
    slug: string | null
    description: string | null
    createdAt: string | null
    updatedAt: string | null
}

interface CategoryState {
    data: Array<Category>
    total: number
    params: DataParams | {}
    allData: Array<Category>
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

// ** Get All Categories
export const getAllCategoriesAsync = createAsyncThunk(
    'appCategories/getAllCategories',
    async (data: TPagination) => {
        try {
            const response = await getAllCategories(data)
            // Check if response is an error object
            if (response instanceof Error) {
                throw response;
            }

            // Check response status
            const checkedResponse = handleResponse(response.data);

            // Ensure response has the correct structure
            if (!checkedResponse.data) {
                return { data: [], totalItems: 0 }
            }

            // Ensure each category has valid data
            const validatedData = (checkedResponse.data || []).map((category: any) => ({
                id: category?.id || null,
                name: category?.name || null,
                slug: category?.slug || null,
                description: category?.description || null,
                createdAt: category?.createdAt || null,
                updatedAt: category?.updatedAt || null
            }))

            return {
                data: validatedData,
                totalItems: checkedResponse.totalItems || 0
            }
        } catch (error: any) {
            console.error('Error fetching categories:', error)
            throw error
        }
    }
)

export const createCategoryAsync = createAsyncThunk(
    'appCategories/createCategory',
    async (data: TCategoryData, {dispatch}) => {
        try {
            const response = await createNewCategory(data)
            // Check if response is an error object
            if (response instanceof Error) {
                throw response;
            }

            // Check response status
            const checkedResponse = handleResponse(response.data);

            // After successfully creating the category, fetch the list again
            dispatch(getAllCategoriesAsync({ page: 0, limit: 10 }))
            return checkedResponse
        } catch (error: any) {
            console.error('Error creating category:', error)
            // Return the error in a structured way
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to create category')
        }
    }
)

export const updateCategoryAsync = createAsyncThunk(
    'appCategories/updateCategory',
    async (data: { id: string | number, name: string, description: string }, { dispatch }) => {
        try {
            const response = await updateCategory(data)
            // Check if response is an error object
            if (response instanceof Error) {
                throw response;
            }

            // Check response status
            const checkedResponse = handleResponse(response.data);

            // After successfully updating the category, fetch the list again
            dispatch(getAllCategoriesAsync({ page: 0, limit: 10 }))
            return checkedResponse
        } catch (error: any) {
            console.error('Error updating category:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to update category')
        }
    }
)

export const deleteCategoryAsync = createAsyncThunk(
    'appCategories/deleteCategory',
    async (id: string | number, { dispatch }) => {
        try {
            const response = await deleteCategory(id)
            // Check if response is an error object
            if (response instanceof Error) {
                throw response;
            }

            // Check response status
            const checkedResponse = handleResponse(response.data);

            // After successfully deleting the category, fetch the list again
            dispatch(getAllCategoriesAsync({ page: 0, limit: 10 }))
            return checkedResponse
        } catch (error: any) {
            console.error('Error deleting category:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to delete category')
        }
    }
)

const initialState: CategoryState = {
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

export const appCategoriesSlice = createSlice({
    name: 'appCategories',
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
        // getAllCategoriesAsync reducers
        builder.addCase(getAllCategoriesAsync.pending, (state) => {
            state.loading.fetchAll = true
        })
        builder.addCase(getAllCategoriesAsync.fulfilled, (state, action) => {
            // Ensure data is never undefined/null
            state.allData = action.payload.data || []
            state.total = action.payload.totalItems || 0
            state.loading.fetchAll = false
            state.error.fetchAll = null
        })
        builder.addCase(getAllCategoriesAsync.rejected, (state, action) => {
            state.loading.fetchAll = false
            state.error.fetchAll = action.error.message || 'Failed to fetch categories'
            // Don't reset existing data when there's an error
        })

        // createCategoryAsync reducers
        builder.addCase(createCategoryAsync.pending, (state) => {
            state.loading.create = true
            state.error.create = null
        })
        builder.addCase(createCategoryAsync.fulfilled, (state) => {
            state.loading.create = false
            state.error.create = null
        })
        builder.addCase(createCategoryAsync.rejected, (state, action) => {
            state.loading.create = false
            state.error.create = action.error.message || 'Failed to create category'
        })

        // updateCategoryAsync reducers
        builder.addCase(updateCategoryAsync.pending, (state) => {
            state.loading.update = true
            state.error.update = null
        })
        builder.addCase(updateCategoryAsync.fulfilled, (state) => {
            state.loading.update = false
            state.error.update = null
        })
        builder.addCase(updateCategoryAsync.rejected, (state, action) => {
            state.loading.update = false
            state.error.update = action.error.message || 'Failed to update category'
        })

        // deleteCategoryAsync reducers
        builder.addCase(deleteCategoryAsync.pending, (state) => {
            state.loading.delete = true
            state.error.delete = null
        })
        builder.addCase(deleteCategoryAsync.fulfilled, (state) => {
            state.loading.delete = false
            state.error.delete = null
        })
        builder.addCase(deleteCategoryAsync.rejected, (state, action) => {
            state.loading.delete = false
            state.error.delete = action.error.message || 'Failed to delete category'
        })
    }
})

export const { clearErrors, resetInitialState } = appCategoriesSlice.actions

export default appCategoriesSlice.reducer