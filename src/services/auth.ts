import type { LoginRequestDto, RegisterRequestDto } from '@/types/auth'
import { useAxiosProxy } from '@/utils/axios'

const instance = useAxiosProxy()

export const login = async (payload: LoginRequestDto) => {
  const response = await instance.post('/auth/login', payload)
  return response.data
}

export const register = async (payload: RegisterRequestDto) => {
  const response = await instance.post('/auth/register', payload)
  return response.data
}
