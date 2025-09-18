import type { ApiResponse } from '@/types/common'
import type { ShortLink, ShortLinkRequestDto } from '@/types/short-link'
import { useAxiosProxy } from '@/utils/axios'

const instance = useAxiosProxy()

const redirect = async (shortCode: string) => {
  const response = await instance.get(`/short-links/redirect/${shortCode}`)
  return response.data
}

const findAll = async (): Promise<ApiResponse<ShortLink[]>> => {
  return await instance.get('/short-links')
}

const create = async (payload: ShortLinkRequestDto): Promise<ApiResponse<ShortLink>> => {
  return await instance.post('/short-links', payload)
}

const me = async (): Promise<ApiResponse<ShortLink[]>> => {
  return await instance.get('/short-links/me')
}

export default {
  redirect,
  findAll,
  create,
  me,
}
