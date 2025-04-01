import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import { TPagination } from "src/types/auth"

import {
    getReviewsByProductId,
    getReviewsByUserId,
    getReviewById,
    getUserReviewForProduct,
    getProductRatingStatistics,
    createReview,
    updateReview,
    deleteReview,
    TReviewData,
    TCreateReviewRequest,
    TUpdateReviewRequest,
    TRatingStatistics
} from "src/services/review"

interface DataParams {
    page: number
    limit: number
    sortBy?: string
    direction?: string
    productId?: number | string
    userId?: number | string
}

interface ReviewState {
    data: Array<TReviewData>
    total: number
    totalPages: number
    currentPage: number
    params: DataParams | {}
    selectedReview: TReviewData | null
    userReview: TReviewData | null
    ratingStatistics: TRatingStatistics | null
    loading: {
        fetchAll: boolean
        fetchOne: boolean
        fetchUserReview: boolean
        fetchStatistics: boolean
        create: boolean
        update: boolean
        delete: boolean
    }
    error: {
        fetchAll: any
        fetchOne: any
        fetchUserReview: any
        fetchStatistics: any
        create: any
        update: any
        delete: any
    }
}

// Helper function to check response status and handle errors
const handleResponse = (response: any) => {
    if (response.status && response.status !== 200) {
        const errorMessage = response.message || 'An error occurred';
        return Promise.reject(errorMessage);
    }
    return response;
};

// ** Get Reviews By Product ID
export const getReviewsByProductIdAsync = createAsyncThunk(
    'appReviews/getReviewsByProductId',
    async (params: { productId: number | string } & TPagination & { sortBy?: string, direction?: string }) => {
        try {
            const { productId, ...paginationParams } = params;
            const response = await getReviewsByProductId(productId, paginationParams);
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data || !checkedResponse.data.reviews) {
                return {
                    reviews: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0
                }
            }

            return {
                reviews: checkedResponse.data.reviews,
                currentPage: checkedResponse.data.currentPage || 0,
                totalItems: checkedResponse.data.totalItems || 0,
                totalPages: checkedResponse.data.totalPages || 0
            }
        } catch (error: any) {
            console.error('Error fetching reviews:', error)
            throw error
        }
    }
)

// ** Get Reviews By User ID
export const getReviewsByUserIdAsync = createAsyncThunk(
    'appReviews/getReviewsByUserId',
    async (params: { userId: number | string } & TPagination) => {
        try {
            const { userId, ...paginationParams } = params;
            const response = await getReviewsByUserId(userId, paginationParams);
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data || !checkedResponse.data.reviews) {
                return {
                    reviews: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0
                }
            }

            return {
                reviews: checkedResponse.data.reviews,
                currentPage: checkedResponse.data.currentPage || 0,
                totalItems: checkedResponse.data.totalItems || 0,
                totalPages: checkedResponse.data.totalPages || 0
            }
        } catch (error: any) {
            console.error('Error fetching reviews:', error)
            throw error
        }
    }
)

// ** Get Review By ID
export const getReviewByIdAsync = createAsyncThunk(
    'appReviews/getReviewById',
    async (id: number | string) => {
        try {
            const response = await getReviewById(id);
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data) {
                return null;
            }

            return checkedResponse.data;
        } catch (error: any) {
            console.error('Error fetching review:', error)
            throw error
        }
    }
)

// ** Get User Review For Product
export const getUserReviewForProductAsync = createAsyncThunk(
    'appReviews/getUserReviewForProduct',
    async (params: { userId: number | string, productId: number | string }) => {
        try {
            const { userId, productId } = params;
            const response = await getUserReviewForProduct(userId, productId);
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data) {
                return null;
            }

            return checkedResponse.data;
        } catch (error: any) {
            console.error('Error fetching user review:', error)
            throw error
        }
    }
)

// ** Get Product Rating Statistics
export const getProductRatingStatisticsAsync = createAsyncThunk(
    'appReviews/getProductRatingStatistics',
    async (productId: number | string) => {
        try {
            const response = await getProductRatingStatistics(productId);
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data) {
                return null;
            }

            return checkedResponse.data;
        } catch (error: any) {
            console.error('Error fetching rating statistics:', error)
            throw error
        }
    }
)

// ** Create Review
export const createReviewAsync = createAsyncThunk(
    'appReviews/createReview',
    async (data: TCreateReviewRequest, { dispatch }) => {
        try {
            const response = await createReview(data);
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            // After successfully creating the review, fetch the reviews again
            dispatch(getReviewsByProductIdAsync({ productId: data.productId, page: 0, limit: 10 }));

            // Also update the rating statistics
            dispatch(getProductRatingStatisticsAsync(data.productId));

            return checkedResponse;
        } catch (error: any) {
            console.error('Error creating review:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to create review')
        }
    }
)

// ** Update Review
export const updateReviewAsync = createAsyncThunk(
    'appReviews/updateReview',
    async (
        { id, data, productId }:
            { id: number | string, data: TUpdateReviewRequest, productId: number | string },
        { dispatch }
    ) => {
        try {
            const response = await updateReview(id, data);
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            // After successfully updating the review, fetch the reviews again
            dispatch(getReviewsByProductIdAsync({ productId, page: 0, limit: 10 }));

            // Also update the rating statistics
            dispatch(getProductRatingStatisticsAsync(productId));

            return checkedResponse;
        } catch (error: any) {
            console.error('Error updating review:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to update review')
        }
    }
)

// ** Delete Review
export const deleteReviewAsync = createAsyncThunk(
    'appReviews/deleteReview',
    async (
        { id, productId }:
            { id: number | string, productId: number | string },
        { dispatch }
    ) => {
        try {
            const response = await deleteReview(id);
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            // After successfully deleting the review, fetch the reviews again
            dispatch(getReviewsByProductIdAsync({ productId, page: 0, limit: 10 }));

            // Also update the rating statistics
            dispatch(getProductRatingStatisticsAsync(productId));

            return checkedResponse;
        } catch (error: any) {
            console.error('Error deleting review:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to delete review')
        }
    }
)

const initialState: ReviewState = {
    data: [],
    total: 0,
    totalPages: 0,
    currentPage: 0,
    params: {},
    selectedReview: null,
    userReview: null,
    ratingStatistics: null,
    loading: {
        fetchAll: false,
        fetchOne: false,
        fetchUserReview: false,
        fetchStatistics: false,
        create: false,
        update: false,
        delete: false
    },
    error: {
        fetchAll: null,
        fetchOne: null,
        fetchUserReview: null,
        fetchStatistics: null,
        create: null,
        update: null,
        delete: null
    }
}

export const appReviewsSlice = createSlice({
    name: 'appReviews',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = {
                fetchAll: null,
                fetchOne: null,
                fetchUserReview: null,
                fetchStatistics: null,
                create: null,
                update: null,
                delete: null
            }
        },
        clearSelectedReview: (state) => {
            state.selectedReview = null;
        },
        clearUserReview: (state) => {
            state.userReview = null;
        },
        resetInitialState: () => {
            return initialState
        }
    },
    extraReducers: builder => {
        // ** Get Reviews By Product ID reducers
        builder.addCase(getReviewsByProductIdAsync.pending, (state) => {
            state.loading.fetchAll = true
        })
        builder.addCase(getReviewsByProductIdAsync.fulfilled, (state, action) => {
            state.data = action.payload.reviews || []
            state.total = action.payload.totalItems || 0
            state.totalPages = action.payload.totalPages || 0
            state.currentPage = action.payload.currentPage || 0
            state.loading.fetchAll = false
            state.error.fetchAll = null
        })
        builder.addCase(getReviewsByProductIdAsync.rejected, (state, action) => {
            state.loading.fetchAll = false
            state.error.fetchAll = action.error.message || 'Failed to fetch reviews'
        })

        // ** Get Reviews By User ID reducers
        builder.addCase(getReviewsByUserIdAsync.pending, (state) => {
            state.loading.fetchAll = true
        })
        builder.addCase(getReviewsByUserIdAsync.fulfilled, (state, action) => {
            state.data = action.payload.reviews || []
            state.total = action.payload.totalItems || 0
            state.totalPages = action.payload.totalPages || 0
            state.currentPage = action.payload.currentPage || 0
            state.loading.fetchAll = false
            state.error.fetchAll = null
        })
        builder.addCase(getReviewsByUserIdAsync.rejected, (state, action) => {
            state.loading.fetchAll = false
            state.error.fetchAll = action.error.message || 'Failed to fetch reviews'
        })

        // ** Get Review By ID reducers
        builder.addCase(getReviewByIdAsync.pending, (state) => {
            state.loading.fetchOne = true
        })
        builder.addCase(getReviewByIdAsync.fulfilled, (state, action) => {
            state.selectedReview = action.payload
            state.loading.fetchOne = false
            state.error.fetchOne = null
        })
        builder.addCase(getReviewByIdAsync.rejected, (state, action) => {
            state.loading.fetchOne = false
            state.error.fetchOne = action.error.message || 'Failed to fetch review'
        })

        // ** Get User Review For Product reducers
        builder.addCase(getUserReviewForProductAsync.pending, (state) => {
            state.loading.fetchUserReview = true
        })
        builder.addCase(getUserReviewForProductAsync.fulfilled, (state, action) => {
            state.userReview = action.payload
            state.loading.fetchUserReview = false
            state.error.fetchUserReview = null
        })
        builder.addCase(getUserReviewForProductAsync.rejected, (state, action) => {
            state.loading.fetchUserReview = false
            state.error.fetchUserReview = action.error.message || 'Failed to fetch user review'
            state.userReview = null // Set to null when review doesn't exist
        })

        // ** Get Product Rating Statistics reducers
        builder.addCase(getProductRatingStatisticsAsync.pending, (state) => {
            state.loading.fetchStatistics = true
        })
        builder.addCase(getProductRatingStatisticsAsync.fulfilled, (state, action) => {
            state.ratingStatistics = action.payload
            state.loading.fetchStatistics = false
            state.error.fetchStatistics = null
        })
        builder.addCase(getProductRatingStatisticsAsync.rejected, (state, action) => {
            state.loading.fetchStatistics = false
            state.error.fetchStatistics = action.error.message || 'Failed to fetch rating statistics'
        })

        // ** Create Review reducers
        builder.addCase(createReviewAsync.pending, (state) => {
            state.loading.create = true
            state.error.create = null
        })
        builder.addCase(createReviewAsync.fulfilled, (state) => {
            state.loading.create = false
            state.error.create = null
        })
        builder.addCase(createReviewAsync.rejected, (state, action) => {
            state.loading.create = false
            state.error.create = action.error.message || 'Failed to create review'
        })

        // ** Update Review reducers
        builder.addCase(updateReviewAsync.pending, (state) => {
            state.loading.update = true
            state.error.update = null
        })
        builder.addCase(updateReviewAsync.fulfilled, (state) => {
            state.loading.update = false
            state.error.update = null
        })
        builder.addCase(updateReviewAsync.rejected, (state, action) => {
            state.loading.update = false
            state.error.update = action.error.message || 'Failed to update review'
        })

        // ** Delete Review reducers
        builder.addCase(deleteReviewAsync.pending, (state) => {
            state.loading.delete = true
            state.error.delete = null
        })
        builder.addCase(deleteReviewAsync.fulfilled, (state) => {
            state.loading.delete = false
            state.error.delete = null
        })
        builder.addCase(deleteReviewAsync.rejected, (state, action) => {
            state.loading.delete = false
            state.error.delete = action.error.message || 'Failed to delete review'
        })
    }
})

export const { clearErrors, clearSelectedReview, clearUserReview, resetInitialState } = appReviewsSlice.actions

export default appReviewsSlice.reducer