export interface LoginRequestDto {
  email: string
  password: string
}

export interface RegisterRequestDto {
  fullName: string
  email: string
  password: string
  confirmPassword?: string
}