import type { User } from './user'
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  confirmPassword?: string
}

export interface LoginResponse {
  accessToken: string
  user: User
}
