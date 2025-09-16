import type { ShortLinkRequestDto } from '@/types/short-link'
import { useAxiosProxy } from '@/utils/axios'

const instance = useAxiosProxy()

export const redirect = async (shortCode: string) => {
  const response = await instance.get(`/short-link/redirect/${shortCode}`)
  return response.data
}

export const findAll = async () => {
  const response = await instance.get('/short-link')
  return response.data
}

export const create = async (payload: ShortLinkRequestDto) => {
  const response = await instance.post('/short-link', payload)
  return response.data
}

export const me = async () => {
  const response = await instance.get('/short-link/me')
  return response.data
}
