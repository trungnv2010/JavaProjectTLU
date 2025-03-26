import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios'
import { toast } from '@/hooks/use-toast'
import { localStorageAuthService } from '@/common/storages/auth-storages'
import { authApi } from './auth'
import { PUBLIC_ROUTES } from '@/common/constants'

const { getAccessToken, removeAccessToken } = localStorageAuthService
const token = getAccessToken()
const NO_RETRY_HEADER = 'x-no-retry'

const options: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  } as AxiosRequestHeaders,
  baseURL: import.meta.env.VITE_API_URL + '/api',
  responseType: 'json',
  withCredentials: true
}
const axiosInstance = axios.create(options)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (!response?.data) {
      return {
        success: true
      }
    }
    if (typeof response?.data === 'string') {
      response.data = JSON.parse(response.data)
    }
    response.data = {
      ...response?.data,
      success: true
    }
    return response.data
  },
  async (error) => {
    const isPublicRoute = PUBLIC_ROUTES.some((route) => error.config.url?.includes(route))
    if (isPublicRoute) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Server error please try again',
        duration: 1500,
        variant: 'error'
      })
      return Promise.reject(error.response?.data || error)
    }
    switch (error.response?.status) {
      case 403:
        return toast({
          title: 'Error',
          description: 'Permission denied, please update to MEMBERSHIP',
          duration: 1500,
          variant: 'error'
        })
      case 400:
        // removeAccessToken();
        // windowGlobal()?.location.replace("/login");
        break
      case 401:
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry && !originalRequest.headers[NO_RETRY_HEADER]) {
          originalRequest._retry = true
          try {
            const access_token = await authApi.refreshToken()
            localStorageAuthService.setAccessToken(access_token || '')
            originalRequest.headers.Authorization = `Bearer ${access_token}`
            return axiosInstance(originalRequest)
          } catch (error) {
            removeAccessToken()
            window.location.replace('/login')
            return Promise.reject(error)
          }
        } else {
          removeAccessToken()
          window.location.replace('/login')
          break
        }
      default:
        break
    }
    toast({
      title: 'Error',
      description: error.response?.data?.message || 'Server error please try again',
      duration: 1500,
      variant: 'error'
    })
    return Promise.reject(error.response?.data || error)
  }
)

export default axiosInstance
