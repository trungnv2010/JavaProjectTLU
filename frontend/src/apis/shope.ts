import { endpoint } from '@/common/constants'
import axiosInstance from '.'

const getListLadingCode = async ({
  ids,
  limit = 10,
  offset = 0
}: {
  ids: string[]
  limit?: number
  offset?: number
}) => {
  const res = await axiosInstance.post(endpoint.ladingCode.getList, {
    cookies: ids,
    limit: limit,
    offset: offset
  })
  return res.data
}

export const shopeApi = { getListLadingCode }
