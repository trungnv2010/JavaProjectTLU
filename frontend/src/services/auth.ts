import axios from "axios";
import {CONFIG_API} from "src/configs/api";
import {TLoginAuth, TRegisterAuth, TUpdateAuthMe} from "src/types/auth";
import instanceAxios from "src/helpers/axios";
import authConfig, {ACCESS_TOKEN} from "src/configs/auth";
import {clearLocalUserData} from "src/helpers/storage";

export const loginAuth = async (data: TLoginAuth) => {
    try {
        const res = await axios.post(`${CONFIG_API.AUTH.INDEX}/login`, data)
        return res.data
    } catch (error) {
        return null
    }
}

export const registerAuth = async (data: TRegisterAuth) => {
    try {
        const res = await axios.post(`${CONFIG_API.AUTH.INDEX}/register`, data)
        return res.data
    } catch (error) {
        return error
    }
}

export const getAuthMe = async () => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.AUTH.AUTH_ME}`)
        return res.data
    } catch (error) {
        return error
    }
}

export const updateAuthMe = async (data: TUpdateAuthMe) => {
    try {
        const res = await instanceAxios.put(`${CONFIG_API.AUTH.AUTH_ME}`, data)
        return res.data
    } catch (error) {
        return error
    }
}