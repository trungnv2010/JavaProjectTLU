import instanceAxios from "src/helpers/axios";
import {CONFIG_API} from "src/configs/api";
import {TPagination} from "src/types/auth";

// Define Order Data Types
export type TOrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type TPaymentStatus = 'unpaid' | 'paid' | 'refunded';

export type TOrderItemData = {
    id?: number | string
    quantity: number
    price: number
    productId: number | string
    productName?: string
    productImageUrl?: string
}

export type TOrderData = {
    id?: number | string
    totalAmount: number
    status: TOrderStatus
    shippingAddress: string
    paymentMethod: string
    paymentStatus: TPaymentStatus
    createdAt?: string
    updatedAt?: string
    userId: number | string
    userName?: string
    orderItems: TOrderItemData[]
}

export type TCreateOrderItemRequest = {
    productId: number | string
    quantity: number
}

export type TCreateOrderRequest = {
    userId: number | string
    shippingAddress: string
    paymentMethod: string
    orderItems: TCreateOrderItemRequest[]
}

export type TUpdateOrderStatusRequest = {
    status: TOrderStatus
}

export type TUpdatePaymentStatusRequest = {
    paymentStatus: TPaymentStatus
}

export type TOrderSearchParams = {
    userId?: number | string
    status?: string
    startDate?: string
    endDate?: string
} & TPagination;

// Get all orders with pagination, sorting
export const getAllOrders = async (data: TPagination & { sortBy?: string, direction?: string }) => {
    try {
        const sortParam = data.sortBy ? `&sortBy=${data.sortBy}` : '';
        const directionParam = data.direction ? `&direction=${data.direction}` : '';
        const res = await instanceAxios.get(
            `${CONFIG_API.ORDER.INDEX}?page=${data.page}&limit=${data.limit}${sortParam}${directionParam}`
        );
        return res;
    } catch (e) {
        return e;
    }
}

// Search orders
export const searchOrders = async (params: TOrderSearchParams) => {
    try {
        let url = `${CONFIG_API.ORDER.INDEX}/search?page=${params.page}&limit=${params.limit}`;

        if (params.userId) url += `&userId=${params.userId}`;
        if (params.status) url += `&status=${params.status}`;
        if (params.startDate) url += `&startDate=${params.startDate}`;
        if (params.endDate) url += `&endDate=${params.endDate}`;

        const res = await instanceAxios.get(url);
        return res;
    } catch (e) {
        return e;
    }
}

// Get order by ID
export const getOrderById = async (id: number | string) => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.ORDER.INDEX}/${id}`);
        return res;
    } catch (e) {
        return e;
    }
}

// Get orders by user ID
export const getOrdersByUserId = async (userId: number | string, data: TPagination) => {
    try {
        const res = await instanceAxios.get(
            `${CONFIG_API.ORDER.INDEX}/user/${userId}?page=${data.page}&limit=${data.limit}`
        );
        return res;
    } catch (e) {
        return e;
    }
}

// Create a new order
export const createOrder = async (data: TCreateOrderRequest) => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.ORDER.INDEX}`, data);
        return res;
    } catch (e) {
        return e;
    }
}

// Update order status
export const updateOrderStatus = async (id: number | string, data: TUpdateOrderStatusRequest) => {
    try {
        const res = await instanceAxios.put(`${CONFIG_API.ORDER.INDEX}/${id}/status`, data);
        return res;
    } catch (e) {
        return e;
    }
}

// Update payment status
export const updatePaymentStatus = async (id: number | string, data: TUpdatePaymentStatusRequest) => {
    try {
        const res = await instanceAxios.put(`${CONFIG_API.ORDER.INDEX}/${id}/payment`, data);
        return res;
    } catch (e) {
        return e;
    }
}

// Cancel order
export const cancelOrder = async (id: number | string) => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.ORDER.INDEX}/${id}/cancel`);
        return res;
    } catch (e) {
        return e;
    }
}

// Get order statistics
export const getOrderStatistics = async () => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.ORDER.INDEX}/statistics`);
        return res;
    } catch (e) {
        return e;
    }
}