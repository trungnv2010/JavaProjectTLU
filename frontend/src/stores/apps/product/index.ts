import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { TPagination } from "src/types/auth"

import {
    getAllProducts,
    getProductsByCategory,
    getProductsByPriceRange,
    getProductsByBrand,
    getAllBrands,
    getProductById,
    createNewProduct,
    updateProduct,
    updateProductStock,
    deleteProduct,
    TProductData
} from "src/services/product"

interface DataParams {
    q: string
    page: number
    limit: number
    sortBy?: string
    direction?: string
}

interface Redux {
    getState: any
    dispatch: Dispatch<any>
}

interface Product {
    id: number | string | null
    name: string | null
    description: string | null
    price: number | null
    discountPrice: number | null
    stockQuantity: number | null
    imageUrl: string | null
    brand: string | null
    model: string | null
    specifications: string | null
    categoryId: number | string | null
    categoryName: string | null
    createdAt: string | null
    updatedAt: string | null
}

interface ProductPaginationResult {
    products: Array<Product>
    currentPage: number
    totalItems: number
    totalPages: number
}

interface ProductState {
    data: Array<Product>
    total: number
    totalPages: number
    currentPage: number
    params: DataParams | {}
    allData: Array<Product>
    selectedProduct: Product | null
    brands: string[]
    loading: {
        fetchAll: boolean
        fetchByCategory: boolean
        fetchByPriceRange: boolean
        fetchByBrand: boolean
        fetchBrands: boolean
        fetchOne: boolean
        create: boolean
        update: boolean
        updateStock: boolean
        delete: boolean
    }
    error: {
        fetchAll: any
        fetchByCategory: any
        fetchByPriceRange: any
        fetchByBrand: any
        fetchBrands: any
        fetchOne: any
        create: any
        update: any
        updateStock: any
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

// ** Get All Products
export const getAllProductsAsync = createAsyncThunk(
    'appProducts/getAllProducts',
    async (data: TPagination & { sortBy?: string, direction?: string }) => {
        try {
            const response = await getAllProducts(data)
            // Check if response is an error object
            if (response instanceof Error) {
                throw response;
            }

            // Check response status
            const checkedResponse = handleResponse(response.data);

            // Ensure response has the correct structure
            if (!checkedResponse.data || !checkedResponse.data.products) {
                return {
                    products: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0
                }
            }

            // Ensure each product has valid data
            const validatedData = (checkedResponse.data.products || []).map((product: any) => ({
                id: product?.id || null,
                name: product?.name || null,
                description: product?.description || null,
                price: product?.price || null,
                discountPrice: product?.discountPrice || null,
                stockQuantity: product?.stockQuantity || null,
                imageUrl: product?.imageUrl || null,
                brand: product?.brand || null,
                model: product?.model || null,
                specifications: product?.specifications || null,
                categoryId: product?.categoryId || null,
                categoryName: product?.categoryName || null,
                createdAt: product?.createdAt || null,
                updatedAt: product?.updatedAt || null
            }))

            return {
                products: validatedData,
                currentPage: checkedResponse.data.currentPage || 0,
                totalItems: checkedResponse.data.totalItems || 0,
                totalPages: checkedResponse.data.totalPages || 0
            }
        } catch (error: any) {
            console.error('Error fetching products:', error)
            throw error
        }
    }
)

// ** Get Products by Category
export const getProductsByCategoryAsync = createAsyncThunk(
    'appProducts/getProductsByCategory',
    async ({ categoryId, pagination }: { categoryId: number | string, pagination: TPagination }) => {
        try {
            const response = await getProductsByCategory(categoryId, pagination)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data || !checkedResponse.data.products) {
                return {
                    products: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0
                }
            }

            const validatedData = (checkedResponse.data.products || []).map((product: any) => ({
                id: product?.id || null,
                name: product?.name || null,
                description: product?.description || null,
                price: product?.price || null,
                discountPrice: product?.discountPrice || null,
                stockQuantity: product?.stockQuantity || null,
                imageUrl: product?.imageUrl || null,
                brand: product?.brand || null,
                model: product?.model || null,
                specifications: product?.specifications || null,
                categoryId: product?.categoryId || null,
                categoryName: product?.categoryName || null,
                createdAt: product?.createdAt || null,
                updatedAt: product?.updatedAt || null
            }))

            return {
                products: validatedData,
                currentPage: checkedResponse.data.currentPage || 0,
                totalItems: checkedResponse.data.totalItems || 0,
                totalPages: checkedResponse.data.totalPages || 0
            }
        } catch (error: any) {
            console.error('Error fetching products by category:', error)
            throw error
        }
    }
)

// ** Get Products by Price Range
export const getProductsByPriceRangeAsync = createAsyncThunk(
    'appProducts/getProductsByPriceRange',
    async ({ minPrice, maxPrice, pagination }: { minPrice: number, maxPrice: number, pagination: TPagination }) => {
        try {
            const response = await getProductsByPriceRange(minPrice, maxPrice, pagination)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data || !checkedResponse.data.products) {
                return {
                    products: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0
                }
            }

            const validatedData = (checkedResponse.data.products || []).map((product: any) => ({
                id: product?.id || null,
                name: product?.name || null,
                description: product?.description || null,
                price: product?.price || null,
                discountPrice: product?.discountPrice || null,
                stockQuantity: product?.stockQuantity || null,
                imageUrl: product?.imageUrl || null,
                brand: product?.brand || null,
                model: product?.model || null,
                specifications: product?.specifications || null,
                categoryId: product?.categoryId || null,
                categoryName: product?.categoryName || null,
                createdAt: product?.createdAt || null,
                updatedAt: product?.updatedAt || null
            }))

            return {
                products: validatedData,
                currentPage: checkedResponse.data.currentPage || 0,
                totalItems: checkedResponse.data.totalItems || 0,
                totalPages: checkedResponse.data.totalPages || 0
            }
        } catch (error: any) {
            console.error('Error fetching products by price range:', error)
            throw error
        }
    }
)

// ** Get Products by Brand
export const getProductsByBrandAsync = createAsyncThunk(
    'appProducts/getProductsByBrand',
    async ({ brand, pagination }: { brand: string, pagination: TPagination }) => {
        try {
            const response = await getProductsByBrand(brand, pagination)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data || !checkedResponse.data.products) {
                return {
                    products: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0
                }
            }

            const validatedData = (checkedResponse.data.products || []).map((product: any) => ({
                id: product?.id || null,
                name: product?.name || null,
                description: product?.description || null,
                price: product?.price || null,
                discountPrice: product?.discountPrice || null,
                stockQuantity: product?.stockQuantity || null,
                imageUrl: product?.imageUrl || null,
                brand: product?.brand || null,
                model: product?.model || null,
                specifications: product?.specifications || null,
                categoryId: product?.categoryId || null,
                categoryName: product?.categoryName || null,
                createdAt: product?.createdAt || null,
                updatedAt: product?.updatedAt || null
            }))

            return {
                products: validatedData,
                currentPage: checkedResponse.data.currentPage || 0,
                totalItems: checkedResponse.data.totalItems || 0,
                totalPages: checkedResponse.data.totalPages || 0
            }
        } catch (error: any) {
            console.error('Error fetching products by brand:', error)
            throw error
        }
    }
)

// ** Get All Brands
export const getAllBrandsAsync = createAsyncThunk(
    'appProducts/getAllBrands',
    async () => {
        try {
            const response = await getAllBrands()
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data) {
                return []
            }

            return checkedResponse.data
        } catch (error: any) {
            console.error('Error fetching brands:', error)
            throw error
        }
    }
)

// ** Get Product by ID
export const getProductByIdAsync = createAsyncThunk(
    'appProducts/getProductById',
    async (id: number | string) => {
        try {
            const response = await getProductById(id)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            if (!checkedResponse.data) {
                return null
            }

            const product = checkedResponse.data;
            return {
                id: product?.id || null,
                name: product?.name || null,
                description: product?.description || null,
                price: product?.price || null,
                discountPrice: product?.discountPrice || null,
                stockQuantity: product?.stockQuantity || null,
                imageUrl: product?.imageUrl || null,
                brand: product?.brand || null,
                model: product?.model || null,
                specifications: product?.specifications || null,
                categoryId: product?.categoryId || null,
                categoryName: product?.categoryName || null,
                createdAt: product?.createdAt || null,
                updatedAt: product?.updatedAt || null
            }
        } catch (error: any) {
            console.error('Error fetching product:', error)
            throw error
        }
    }
)

// ** Create Product
export const createProductAsync = createAsyncThunk(
    'appProducts/createProduct',
    async (data: TProductData, {dispatch}) => {
        try {
            const response = await createNewProduct(data)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            // After successfully creating the product, fetch the list again
            dispatch(getAllProductsAsync({ page: 0, limit: 0, search: "" }))
            return checkedResponse
        } catch (error: any) {
            console.error('Error creating product:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to create product')
        }
    }
)

// ** Update Product
export const updateProductAsync = createAsyncThunk(
    'appProducts/updateProduct',
    async (data: TProductData, { dispatch }) => {
        try {
            const response = await updateProduct(data)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            // After successfully updating the product, fetch the list again
            dispatch(getAllProductsAsync({ page: 0, limit: 0, search: "" }))
            return checkedResponse
        } catch (error: any) {
            console.error('Error updating product:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to update product')
        }
    }
)

// ** Update Product Stock
export const updateProductStockAsync = createAsyncThunk(
    'appProducts/updateProductStock',
    async ({ id, quantity }: { id: number | string, quantity: number }, { dispatch }) => {
        try {
            const response = await updateProductStock(id, quantity)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            // After successfully updating the stock, fetch the product again
            dispatch(getProductByIdAsync(id))
            return checkedResponse
        } catch (error: any) {
            console.error('Error updating product stock:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to update product stock')
        }
    }
)

// ** Delete Product
export const deleteProductAsync = createAsyncThunk(
    'appProducts/deleteProduct',
    async (id: string | number, { dispatch }) => {
        try {
            const response = await deleteProduct(id)
            if (response instanceof Error) {
                throw response;
            }

            const checkedResponse = handleResponse(response.data);

            // After successfully deleting the product, fetch the list again
            dispatch(getAllProductsAsync({ page: 0, limit: 0, search: "" }))
            return checkedResponse
        } catch (error: any) {
            console.error('Error deleting product:', error)
            if (typeof error === 'string') {
                return Promise.reject(error);
            }
            return Promise.reject(error?.response?.data?.message || 'Failed to delete product')
        }
    }
)

const initialState: ProductState = {
    data: [],
    total: 0,
    totalPages: 0,
    currentPage: 0,
    params: {},
    allData: [],
    selectedProduct: null,
    brands: [],
    loading: {
        fetchAll: false,
        fetchByCategory: false,
        fetchByPriceRange: false,
        fetchByBrand: false,
        fetchBrands: false,
        fetchOne: false,
        create: false,
        update: false,
        updateStock: false,
        delete: false
    },
    error: {
        fetchAll: null,
        fetchByCategory: null,
        fetchByPriceRange: null,
        fetchByBrand: null,
        fetchBrands: null,
        fetchOne: null,
        create: null,
        update: null,
        updateStock: null,
        delete: null
    }
}

export const appProductsSlice = createSlice({
    name: 'appProducts',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = {
                fetchAll: null,
                fetchByCategory: null,
                fetchByPriceRange: null,
                fetchByBrand: null,
                fetchBrands: null,
                fetchOne: null,
                create: null,
                update: null,
                updateStock: null,
                delete: null
            }
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
        resetInitialState: () => {
            return initialState
        }
    },
    extraReducers: builder => {
        // getAllProductsAsync reducers
        builder.addCase(getAllProductsAsync.pending, (state) => {
            state.loading.fetchAll = true
        })
        builder.addCase(getAllProductsAsync.fulfilled, (state, action) => {
            state.allData = action.payload.products || []
            state.data = action.payload.products || []
            state.total = action.payload.totalItems || 0
            state.totalPages = action.payload.totalPages || 0
            state.currentPage = action.payload.currentPage || 0
            state.loading.fetchAll = false
            state.error.fetchAll = null
        })
        builder.addCase(getAllProductsAsync.rejected, (state, action) => {
            state.loading.fetchAll = false
            state.error.fetchAll = action.error.message || 'Failed to fetch products'
        })

        // getProductsByCategoryAsync reducers
        builder.addCase(getProductsByCategoryAsync.pending, (state) => {
            state.loading.fetchByCategory = true
        })
        builder.addCase(getProductsByCategoryAsync.fulfilled, (state, action) => {
            state.data = action.payload.products || []
            state.total = action.payload.totalItems || 0
            state.totalPages = action.payload.totalPages || 0
            state.currentPage = action.payload.currentPage || 0
            state.loading.fetchByCategory = false
            state.error.fetchByCategory = null
        })
        builder.addCase(getProductsByCategoryAsync.rejected, (state, action) => {
            state.loading.fetchByCategory = false
            state.error.fetchByCategory = action.error.message || 'Failed to fetch products by category'
        })

        // getProductsByPriceRangeAsync reducers
        builder.addCase(getProductsByPriceRangeAsync.pending, (state) => {
            state.loading.fetchByPriceRange = true
        })
        builder.addCase(getProductsByPriceRangeAsync.fulfilled, (state, action) => {
            state.data = action.payload.products || []
            state.total = action.payload.totalItems || 0
            state.totalPages = action.payload.totalPages || 0
            state.currentPage = action.payload.currentPage || 0
            state.loading.fetchByPriceRange = false
            state.error.fetchByPriceRange = null
        })
        builder.addCase(getProductsByPriceRangeAsync.rejected, (state, action) => {
            state.loading.fetchByPriceRange = false
            state.error.fetchByPriceRange = action.error.message || 'Failed to fetch products by price range'
        })

        // getProductsByBrandAsync reducers
        builder.addCase(getProductsByBrandAsync.pending, (state) => {
            state.loading.fetchByBrand = true
        })
        builder.addCase(getProductsByBrandAsync.fulfilled, (state, action) => {
            state.data = action.payload.products || []
            state.total = action.payload.totalItems || 0
            state.totalPages = action.payload.totalPages || 0
            state.currentPage = action.payload.currentPage || 0
            state.loading.fetchByBrand = false
            state.error.fetchByBrand = null
        })
        builder.addCase(getProductsByBrandAsync.rejected, (state, action) => {
            state.loading.fetchByBrand = false
            state.error.fetchByBrand = action.error.message || 'Failed to fetch products by brand'
        })

        // getAllBrandsAsync reducers
        builder.addCase(getAllBrandsAsync.pending, (state) => {
            state.loading.fetchBrands = true
        })
        builder.addCase(getAllBrandsAsync.fulfilled, (state, action) => {
            state.brands = action.payload || []
            state.loading.fetchBrands = false
            state.error.fetchBrands = null
        })
        builder.addCase(getAllBrandsAsync.rejected, (state, action) => {
            state.loading.fetchBrands = false
            state.error.fetchBrands = action.error.message || 'Failed to fetch brands'
        })

        // getProductByIdAsync reducers
        builder.addCase(getProductByIdAsync.pending, (state) => {
            state.loading.fetchOne = true
        })
        builder.addCase(getProductByIdAsync.fulfilled, (state, action) => {
            state.selectedProduct = action.payload
            state.loading.fetchOne = false
            state.error.fetchOne = null
        })
        builder.addCase(getProductByIdAsync.rejected, (state, action) => {
            state.loading.fetchOne = false
            state.error.fetchOne = action.error.message || 'Failed to fetch product'
        })

        // createProductAsync reducers
        builder.addCase(createProductAsync.pending, (state) => {
            state.loading.create = true
            state.error.create = null
        })
        builder.addCase(createProductAsync.fulfilled, (state) => {
            state.loading.create = false
            state.error.create = null
        })
        builder.addCase(createProductAsync.rejected, (state, action) => {
            state.loading.create = false
            state.error.create = action.error.message || 'Failed to create product'
        })

        // updateProductAsync reducers
        builder.addCase(updateProductAsync.pending, (state) => {
            state.loading.update = true
            state.error.update = null
        })
        builder.addCase(updateProductAsync.fulfilled, (state) => {
            state.loading.update = false
            state.error.update = null
        })
        builder.addCase(updateProductAsync.rejected, (state, action) => {
            state.loading.update = false
            state.error.update = action.error.message || 'Failed to update product'
        })

        // updateProductStockAsync reducers
        builder.addCase(updateProductStockAsync.pending, (state) => {
            state.loading.updateStock = true
            state.error.updateStock = null
        })
        builder.addCase(updateProductStockAsync.fulfilled, (state) => {
            state.loading.updateStock = false
            state.error.updateStock = null
        })
        builder.addCase(updateProductStockAsync.rejected, (state, action) => {
            state.loading.updateStock = false
            state.error.updateStock = action.error.message || 'Failed to update product stock'
        })

        // deleteProductAsync reducers
        builder.addCase(deleteProductAsync.pending, (state) => {
            state.loading.delete = true
            state.error.delete = null
        })
        builder.addCase(deleteProductAsync.fulfilled, (state) => {
            state.loading.delete = false
            state.error.delete = null
        })
        builder.addCase(deleteProductAsync.rejected, (state, action) => {
            state.loading.delete = false
            state.error.delete = action.error.message || 'Failed to delete product'
        })
    }
})

export const { clearErrors, clearSelectedProduct, resetInitialState } = appProductsSlice.actions

export default appProductsSlice.reducer