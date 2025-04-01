export const BASE_URL = process.env.NEXT_PUBLIC_API_HOST

export const CONFIG_API = {
    AUTH: {
        INDEX: `${BASE_URL}/auth`,
        AUTH_ME: `${BASE_URL}/user/me`,
    },
    USER: {
        ALL: `${BASE_URL}/user/all`,
        CREATE: `${BASE_URL}/user/create`,
        UPDATE: `${BASE_URL}/user/update`,
        DELETE: `${BASE_URL}/user`,
    },
    CATEGORY: {
        INDEX: `${BASE_URL}/category`,
    },
    PRODUCT: {
        INDEX: `${BASE_URL}/product`,
    },
    ORDER: {
        INDEX: `${BASE_URL}/order`,
    },
    REVIEW: {
        INDEX: `${BASE_URL}/review`,
    },


}