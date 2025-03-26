import { Mutex } from 'async-mutex'
import axiosInstance from '.'
import { endpoint } from '@/common/constants/endpoint'
import { TLoginSchema, TRegisterSchema } from '@/schema/auth'
import { IAuth } from '@/types/auth'

const mutex = new Mutex()

const refreshToken = async () => {
  return await mutex.runExclusive(async () => {
    const res = await axiosInstance.get(endpoint.auth.refreshToken)
    if (res && res.data) return res.data.access_token
    else return null
  })
}

const getMe = async () => {
  const res = await axiosInstance.get(endpoint.auth.getMe)
  return res.data
}
const login = async (payload: TLoginSchema): Promise<{ accessToken: string; user: IAuth }> => {
  const res = await axiosInstance.post(endpoint.auth.login, payload)
  return res.data
}
const register = async (payload: Omit<TRegisterSchema, 'confirmPassword'>) => {
  const res = await axiosInstance.post(endpoint.auth.register, payload)
  return res.data
}

export const authApi = { refreshToken, getMe, login, register }
