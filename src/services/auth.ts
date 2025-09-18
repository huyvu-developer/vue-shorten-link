import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth'
import type { ApiResponse } from '@/types/common'
import type { User } from '@/types/user'
import { useAxiosProxy } from '@/utils/axios'

const instance = useAxiosProxy()

const login = async (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  return await instance.post('/auth/login', payload)
}

const register = async (payload: RegisterRequest): Promise<ApiResponse<User>> => {
  return await instance.post('/auth/register', payload)
}

const verify = async (): Promise<ApiResponse<User>> => {
  return await instance.get('/auth/verify-token')
}

export default {
  login,
  register,
  verify,
}
