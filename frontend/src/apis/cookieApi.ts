import { endpoint } from '@/common/constants'
import axiosInstance from '.'

const addCookie = async (value: string) => {
  const res = await axiosInstance.post(endpoint.cookie.add, { cookies: value })
  return res.data
}

const getAllCookie = async () => {
  const res = await axiosInstance.get(endpoint.cookie.getAll)
  return res.data
}

const useCookie = async (id: string, isUsed: boolean) => {
  const res = await axiosInstance.post(endpoint.cookie.use, { cookieId: id, isUsed })
  return res.data
}

export const cookieApi = { addCookie, getAllCookie, useCookie }
