import instanceAxios from "src/helpers/axios";
import {CONFIG_API} from "src/configs/api";
import {TPagination} from "src/types/auth";


export type TRating = 1 | 2 | 3 | 4 | 5;

export type TReviewData = {
    id?: number | string
    rating: TRating
    comment?: string
    createdAt?: string
    updatedAt?: string
    productId: number | string
    productName?: string
    userId: number | string
    userName?: string
}

export type TCreateReviewRequest = {
    productId: number | string
    userId: number | string
    rating: TRating
    comment?: string
}

export type TUpdateReviewRequest = {
    rating: TRating
    comment?: string
}

export type TRatingStatistics = {
    averageRating: number
    totalReviews: number
    ratingDistribution: {
        '1': number,
        '2': number,
        '3': number,
        '4': number,
        '5': number
    }
}

// Get reviews by product ID
export const getReviewsByProductId = async (productId: number | string, data: TPagination & { sortBy?: string, direction?: string }) => {
    try {
        const sortParam = data.sortBy ? `&sortBy=${data.sortBy}` : '';
        const directionParam = data.direction ? `&direction=${data.direction}` : '';
        const res = await instanceAxios.get(
            `${CONFIG_API.REVIEW.INDEX}/product/${productId}?page=${data.page}&limit=${data.limit}${sortParam}${directionParam}`
        );
        return res;
    } catch (e) {
        return e;
    }
}

// Get reviews by user ID
export const getReviewsByUserId = async (userId: number | string, data: TPagination) => {
    try {
        const res = await instanceAxios.get(
            `${CONFIG_API.REVIEW.INDEX}/user/${userId}?page=${data.page}&limit=${data.limit}`
        );
        return res;
    } catch (e) {
        return e;
    }
}

// Get review by ID
export const getReviewById = async (id: number | string) => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.REVIEW.INDEX}/${id}`);
        return res;
    } catch (e) {
        return e;
    }
}

// Get user review for product
export const getUserReviewForProduct = async (userId: number | string, productId: number | string) => {
    try {
        const res = await instanceAxios.get(
            `${CONFIG_API.REVIEW.INDEX}/user/${userId}/product/${productId}`
        );
        return res;
    } catch (e) {
        return e;
    }
}

// Get product rating statistics
export const getProductRatingStatistics = async (productId: number | string) => {
    try {
        const res = await instanceAxios.get(
            `${CONFIG_API.REVIEW.INDEX}/product/${productId}/statistics`
        );
        return res;
    } catch (e) {
        return e;
    }
}

// Create a new review
export const createReview = async (data: TCreateReviewRequest) => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.REVIEW.INDEX}`, data);
        return res;
    } catch (e) {
        return e;
    }
}

// Update a review
export const updateReview = async (id: number | string, data: TUpdateReviewRequest) => {
    try {
        const res = await instanceAxios.put(`${CONFIG_API.REVIEW.INDEX}/${id}`, data);
        return res;
    } catch (e) {
        return e;
    }
}

// Delete a review
export const deleteReview = async (id: number | string) => {
    try {
        const res = await instanceAxios.delete(`${CONFIG_API.REVIEW.INDEX}/${id}`);
        return res;
    } catch (e) {
        return e;
    }
}