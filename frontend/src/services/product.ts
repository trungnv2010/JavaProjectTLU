import instanceAxios from "src/helpers/axios";
import {CONFIG_API} from "src/configs/api";
import {TPagination} from "src/types/auth";

// Define the Product Data Type
export type TProductData = {
    id?: number | string
    name: string
    description: string
    price: number
    discountPrice?: number
    stockQuantity: number
    imageUrl?: string
    brand?: string
    model?: string
    specifications?: string
    categoryId: number | string
}

// Get all products with pagination, search, and sorting
export const getAllProducts = async (data: TPagination & { sortBy?: string, direction?: string }) => {
    try {
        const sortParam = data.sortBy ? `&sortBy=${data.sortBy}` : '';
        const directionParam = data.direction ? `&direction=${data.direction}` : '';
        const res = await instanceAxios.get(
            `${CONFIG_API.PRODUCT.INDEX}?page=${data.page}&limit=${data.limit}&search=${data.search}${sortParam}${directionParam}`
        );
        console.log("res", res.data)
        return res;
    } catch (e) {
        return e;
    }
}

// Get products by category
export const getProductsByCategory = async (categoryId: number | string, data: TPagination) => {
    try {
        const res = await instanceAxios.get(
            `${CONFIG_API.PRODUCT.INDEX}/category/${categoryId}?page=${data.page}&limit=${data.limit}`
        );
        return res;
    } catch (e) {
        return e;
    }
}

// Get products by price range
export const getProductsByPriceRange = async (minPrice: number, maxPrice: number, data: TPagination) => {
    try {
        const res = await instanceAxios.get(
            `${CONFIG_API.PRODUCT.INDEX}/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${data.page}&limit=${data.limit}`
        );
        return res;
    } catch (e) {
        return e;
    }
}

// Get products by brand
export const getProductsByBrand = async (brand: string, data: TPagination) => {
    try {
        const res = await instanceAxios.get(
            `${CONFIG_API.PRODUCT.INDEX}/brand/${brand}?page=${data.page}&limit=${data.limit}`
        );
        return res;
    } catch (e) {
        return e;
    }
}

// Get all brands
export const getAllBrands = async () => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.PRODUCT.INDEX}/brands`);
        return res;
    } catch (e) {
        return e;
    }
}

// Get product by ID
export const getProductById = async (id: number | string) => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.PRODUCT.INDEX}/${id}`);
        return res;
    } catch (e) {
        return e;
    }
}

// Create new product
export const createNewProduct = async (data: TProductData) => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.PRODUCT.INDEX}`, data);
        return res;
    } catch (e) {
        return e;
    }
}

// Update existing product
export const updateProduct = async (data: TProductData) => {
    const {id, ...rest} = data;
    try {
        const res = await instanceAxios.put(`${CONFIG_API.PRODUCT.INDEX}/${id}`, rest);
        return res;
    } catch (e) {
        return e;
    }
}

// Update product stock
export const updateProductStock = async (id: number | string, quantity: number) => {
    try {
        const res = await instanceAxios.patch(`${CONFIG_API.PRODUCT.INDEX}/${id}/stock?quantity=${quantity}`);
        return res;
    } catch (e) {
        return e;
    }
}

// Delete product
export const deleteProduct = async (id: number | string) => {
    try {
        const res = await instanceAxios.delete(`${CONFIG_API.PRODUCT.INDEX}/${id}`);
        return res;
    } catch (e) {
        return e;
    }
}