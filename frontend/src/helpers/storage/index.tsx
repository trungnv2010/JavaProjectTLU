import {ACCESS_TOKEN, USER_DATA} from "src/configs/auth";

export const setLocalUserData = (userData: string, accessToken: string) => {
    return {
        userData: window.localStorage.setItem(USER_DATA, userData),
        accessToken: window.localStorage.setItem(ACCESS_TOKEN, accessToken)
    }
}

export const getLocalUserData = () => {
    return {
        userData: window.localStorage.getItem(USER_DATA),
        accessToken: window.localStorage.getItem(ACCESS_TOKEN)
    }
}

export const clearLocalUserData = () => {
    window.localStorage.removeItem(USER_DATA)
    window.localStorage.removeItem(ACCESS_TOKEN)
}