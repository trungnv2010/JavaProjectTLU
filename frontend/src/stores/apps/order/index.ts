import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import { TPagination } from "src/types/auth"

import {
    getAllOrders,
    searchOrders,
    getOrderById,
    getOrdersByUserId,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getOrderStatistics,
    TOrderData,
    TCreateOrderRequest,
    TUpdateOrderStatusRequest,
    TUpdatePaymentStatusRequest,
    TOrderSearchParams
} from "src/services/order"

interface DataParams {
    page: number
    limit: number
    sortBy?: string
    direction?: string
    userId?: number | string
    status?: string
    startDate?: string
    endDate?: string
}

interface OrderState {
    data: Array<TOrderData>
    total: number
    totalPages: number
    currentPage: number
    params: DataParams | {}
    selectedOrder: TOrderData | null
    statistics: any
    loading: {
        fetchAll: boolean
        fetchOne: boolean
        create: boolean
        updateStatus: boolean
        updatePayment: boolean
        cancel: boolean
        fetchStatistics: boolean
    }
    error: {
        fetchAll: any
        fetchOne: any
        create: any
        updateStatus: any
        updatePayment: any
        cancel: any
        fetchStatistics: any
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

// ** Get All Orders
export const getAllOrdersAsync = createAsyncThunk(
    'appOrders/getAllOrders',
    async (data: TPagination & { sortBy?: string, direction?: string }) => {
        try {
            const response = await getAllOrders(data)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data || !checkedResponse.data.orders) {
                return {
                    orders: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0
                }
            }

            return {
                orders: checkedResponse.data.orders,
                currentPage: checkedResponse.data.currentPage || 0,
                totalItems: checkedResponse.data.totalItems || 0,
                totalPages: checkedResponse.data.totalPages || 0
            }
        } catch (error: any) {
            console.error('Error fetching orders:', error)
            throw error
        }
    }
)

// ** Search Orders
export const searchOrdersAsync = createAsyncThunk(
    'appOrders/searchOrders',
    async (params: TOrderSearchParams) => {
        try {
            const response = await searchOrders(params)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data || !checkedResponse.data.orders) {
                return {
                    orders: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0
                }
            }

            return {
                orders: checkedResponse.data.orders,
                currentPage: checkedResponse.data.currentPage || 0,
                totalItems: checkedResponse.data.totalItems || 0,
                totalPages: checkedResponse.data.totalPages || 0
            }
        } catch (error: any) {
            console.error('Error searching orders:', error)
            throw error
        }
    }
)

// ** Get Order by ID
export const getOrderByIdAsync = createAsyncThunk(
    'appOrders/getOrderById',
    async (id: number | string) => {
        try {
            const response = await getOrderById(id)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data) {
                return null
            }

            return checkedResponse.data
        } catch (error: any) {
            console.error('Error fetching order:', error)
            throw error
        }
    }
)

// ** Create Order
export const createOrderAsync = createAsyncThunk(
    'appOrders/createOrder',
    async (data: TCreateOrderRequest, { dispatch }) => {
        try {
            const response = await createOrder(data)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            // After successfully creating the order, fetch the list again
            dispatch(getAllOrdersAsync({ page: 0, limit: 10 }))
            return checkedResponse
        } catch (error: any) {
            console.error('Error creating order:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to create order')
        }
    }
)

// ** Update Order Status
export const updateOrderStatusAsync = createAsyncThunk(
    'appOrders/updateOrderStatus',
    async ({ id, data }: { id: number | string, data: TUpdateOrderStatusRequest }, { dispatch }) => {
        try {
            const response = await updateOrderStatus(id, data)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            // After successfully updating the order status, fetch the order again
            dispatch(getOrderByIdAsync(id))
            return checkedResponse
        } catch (error: any) {
            console.error('Error updating order status:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to update order status')
        }
    }
)

// ** Update Payment Status
export const updatePaymentStatusAsync = createAsyncThunk(
    'appOrders/updatePaymentStatus',
    async ({ id, data }: { id: number | string, data: TUpdatePaymentStatusRequest }, { dispatch }) => {
        try {
            const response = await updatePaymentStatus(id, data)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            // After successfully updating the payment status, fetch the order again
            dispatch(getOrderByIdAsync(id))
            return checkedResponse
        } catch (error: any) {
            console.error('Error updating payment status:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to update payment status')
        }
    }
)

// ** Cancel Order
export const cancelOrderAsync = createAsyncThunk(
    'appOrders/cancelOrder',
    async (id: number | string, { dispatch }) => {
        try {
            const response = await cancelOrder(id)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            // After successfully cancelling the order, fetch the list again
            dispatch(getAllOrdersAsync({ page: 0, limit: 10 }))
            return checkedResponse
        } catch (error: any) {
            console.error('Error cancelling order:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to cancel order')
        }
    }
)

// ** Get Order Statistics
export const getOrderStatisticsAsync = createAsyncThunk(
    'appOrders/getOrderStatistics',
    async () => {
        try {
            const response = await getOrderStatistics()
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data) {
                return {}
            }

            return checkedResponse.data
        } catch (error: any) {
            console.error('Error fetching order statistics:', error)
            throw error
        }
    }
)

const initialState: OrderState = {
    data: [],
    total: 0,
    totalPages: 0,
    currentPage: 0,
    params: {},
    selectedOrder: null,
    statistics: {},
    loading: {
        fetchAll: false,
        fetchOne: false,
        create: false,
        updateStatus: false,
        updatePayment: false,
        cancel: false,
        fetchStatistics: false
    },
    error: {
        fetchAll: null,
        fetchOne: null,
        create: null,
        updateStatus: null,
        updatePayment: null,
        cancel: null,
        fetchStatistics: null
    }
}

export const appOrdersSlice = createSlice({
    name: 'appOrders',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = {
                fetchAll: null,
                fetchOne: null,
                create: null,
                updateStatus: null,
                updatePayment: null,
                cancel: null,
                fetchStatistics: null
            }
        },
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        },
        resetInitialState: () => {
            return initialState
        }
    },
    extraReducers: builder => {
        // ** Get All Orders reducers
        builder.addCase(getAllOrdersAsync.pending, (state) => {
            state.loading.fetchAll = true
        })
        builder.addCase(getAllOrdersAsync.fulfilled, (state, action) => {
            state.data = action.payload.orders || []
            state.total = action.payload.totalItems || 0
            state.totalPages = action.payload.totalPages || 0
            state.currentPage = action.payload.currentPage || 0
            state.loading.fetchAll = false
            state.error.fetchAll = null
        })
        builder.addCase(getAllOrdersAsync.rejected, (state, action) => {
            state.loading.fetchAll = false
            state.error.fetchAll = action.error.message || 'Failed to fetch orders'
        })

        // ** Search Orders reducers
        builder.addCase(searchOrdersAsync.pending, (state) => {
            state.loading.fetchAll = true
        })
        builder.addCase(searchOrdersAsync.fulfilled, (state, action) => {
            state.data = action.payload.orders || []
            state.total = action.payload.totalItems || 0
            state.totalPages = action.payload.totalPages || 0
            state.currentPage = action.payload.currentPage || 0
            state.loading.fetchAll = false
            state.error.fetchAll = null
        })
        builder.addCase(searchOrdersAsync.rejected, (state, action) => {
            state.loading.fetchAll = false
            state.error.fetchAll = action.error.message || 'Failed to search orders'
        })

        // ** Get Order by ID reducers
        builder.addCase(getOrderByIdAsync.pending, (state) => {
            state.loading.fetchOne = true
        })
        builder.addCase(getOrderByIdAsync.fulfilled, (state, action) => {
            state.selectedOrder = action.payload
            state.loading.fetchOne = false
            state.error.fetchOne = null
        })
        builder.addCase(getOrderByIdAsync.rejected, (state, action) => {
            state.loading.fetchOne = false
            state.error.fetchOne = action.error.message || 'Failed to fetch order'
        })

        // ** Create Order reducers
        builder.addCase(createOrderAsync.pending, (state) => {
            state.loading.create = true
            state.error.create = null
        })
        builder.addCase(createOrderAsync.fulfilled, (state) => {
            state.loading.create = false
            state.error.create = null
        })
        builder.addCase(createOrderAsync.rejected, (state, action) => {
            state.loading.create = false
            state.error.create = action.error.message || 'Failed to create order'
        })

        // ** Update Order Status reducers
        builder.addCase(updateOrderStatusAsync.pending, (state) => {
            state.loading.updateStatus = true
            state.error.updateStatus = null
        })
        builder.addCase(updateOrderStatusAsync.fulfilled, (state) => {
            state.loading.updateStatus = false
            state.error.updateStatus = null
        })
        builder.addCase(updateOrderStatusAsync.rejected, (state, action) => {
            state.loading.updateStatus = false
            state.error.updateStatus = action.error.message || 'Failed to update order status'
        })

        // ** Update Payment Status reducers
        builder.addCase(updatePaymentStatusAsync.pending, (state) => {
            state.loading.updatePayment = true
            state.error.updatePayment = null
        })
        builder.addCase(updatePaymentStatusAsync.fulfilled, (state) => {
            state.loading.updatePayment = false
            state.error.updatePayment = null
        })
        builder.addCase(updatePaymentStatusAsync.rejected, (state, action) => {
            state.loading.updatePayment = false
            state.error.updatePayment = action.error.message || 'Failed to update payment status'
        })

        // ** Cancel Order reducers
        builder.addCase(cancelOrderAsync.pending, (state) => {
            state.loading.cancel = true
            state.error.cancel = null
        })
        builder.addCase(cancelOrderAsync.fulfilled, (state) => {
            state.loading.cancel = false
            state.error.cancel = null
        })
        builder.addCase(cancelOrderAsync.rejected, (state, action) => {
            state.loading.cancel = false
            state.error.cancel = action.error.message || 'Failed to cancel order'
        })

        // ** Get Order Statistics reducers
        builder.addCase(getOrderStatisticsAsync.pending, (state) => {
            state.loading.fetchStatistics = true
        })
        builder.addCase(getOrderStatisticsAsync.fulfilled, (state, action) => {
            state.statistics = action.payload || {}
            state.loading.fetchStatistics = false
            state.error.fetchStatistics = null
        })
        builder.addCase(getOrderStatisticsAsync.rejected, (state, action) => {
            state.loading.fetchStatistics = false
            state.error.fetchStatistics = action.error.message || 'Failed to fetch order statistics'
        })
    }
})

export const { clearErrors, clearSelectedOrder, resetInitialState } = appOrdersSlice.actions

export default appOrdersSlice.reducer