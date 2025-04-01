import instanceAxios from "src/helpers/axios";
import {CONFIG_API} from "src/configs/api";
import {TPagination} from "src/types/auth";
import {UserDataType} from "src/contexts/types";

export const getAllUser = async (data: TPagination) => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.USER.ALL}`, data)
        return res
    } catch (e) {
        return e
    }
}

export type TUserData = {
    id?: number
    role: string
    email: string
    firstname: string
    lastname: string
    phone: string,
    city: string,
}

export const createNewUser = async (data: TUserData) => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.USER.CREATE}`,  data)
        return res
    } catch (e) {
        return e
    }
}

export const updateUser = async (data: TUserData) => {
    const {id, ...rests} = data
    try {
        const res = await instanceAxios.put(`${CONFIG_API.USER.UPDATE}/${id}`,  rests)
        return res
    } catch (e) {
        return e
    }
}

export const deleteUser = async (id: number) => {
    try {
        const res = await instanceAxios.delete(`${CONFIG_API.USER.DELETE}/${id}`)
        return res
    } catch (e) {
        return e
    }
}