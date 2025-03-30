import axios from "axios";
import { BASE_URL } from "src/configs/api";
import authConfig, { ACCESS_TOKEN } from "src/configs/auth";

// Create axios instance with base URL
const instanceAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding token
instanceAxios.interceptors.request.use(
    config => {
        const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
        if (storedToken) {
            config.headers['Authorization'] = `Bearer ${storedToken}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);



export default instanceAxios;