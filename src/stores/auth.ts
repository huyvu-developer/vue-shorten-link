import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'
import type { LoginRequest, RegisterRequest } from '@/types/auth'
import authService from '@/services/auth'
import type { ApiResponse } from '@/types/common'
import { setCookie, getCookie, removeCookie } from '@/utils/cookies'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  const login = async (payload: LoginRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.login(payload)
      if (response.statusCode === 201) {
        user.value = response.data.user
        setCookie('accessToken', response.data.accessToken)
      } else {
        error.value = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (payload: RegisterRequest) => {
    isLoading.value = true
    error.value = null

    try {
      if (payload.password !== payload.confirmPassword) {
        throw new Error('Mật khẩu xác nhận không khớp')
      }

      const response = await authService.register({
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
      })
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    removeCookie('accessToken')
  }

  const clearError = () => {
    error.value = null
  }

  const authorize = async () => {
    isLoading.value = true
    error.value = null

    try {
      const accessToken = getCookie('accessToken')
      if (accessToken) {
        const response: ApiResponse<User> = await authService.verify()
        if (response.statusCode === 200) {
          user.value = response.data
        } else {
          removeCookie('accessToken')
          user.value = null
        }
      } else {
        removeCookie('accessToken')
        user.value = null
      }
    } catch (err) {
      removeCookie('accessToken')
      user.value = null
      error.value = err instanceof Error ? err.message : 'Xác thực thất bại'
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    authorize,
  }
})
