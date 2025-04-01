import instanceAxios from "src/helpers/axios";
import {CONFIG_API} from "src/configs/api";
import {TPagination} from "src/types/auth";

// Define the Category Data Type
export type TCategoryData = {
    id?: number | string
    name: string
    description: string,
    search?: string
}

// Get all categories
export const getAllCategories = async (data: TPagination) => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.CATEGORY.INDEX}?page=${data.page}&limit=${data.limit}&search=${data.search}`)

        return res
    } catch (e) {
        return e
    }
}

// Create new category
export const createNewCategory = async (data: {name: string, description: string}) => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.CATEGORY.INDEX}`, data)
        return res
    } catch (e) {
        return e
    }
}

// Update existing category
export const updateCategory = async (data: {name: string, description: string, id: number | string}) => {
    const {id, ...rests} = data
    try {
        const res = await instanceAxios.put(`${CONFIG_API.CATEGORY.INDEX}/${id}`, rests)
        return res
    } catch (e) {
        return e
    }
}

// Delete category
export const deleteCategory = async (id: number | string) => {
    try {
        // Sửa lại endpoint URL đúng cho category
        const res = await instanceAxios.delete(`${CONFIG_API.CATEGORY.INDEX}/${id}`)
        return res
    } catch (e) {
        return e
    }
}