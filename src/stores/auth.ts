import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      // Mock API call - replace with real API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful login
      user.value = {
        id: '1',
        email: credentials.email,
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      }

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err) {
      error.value = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Mật khẩu xác nhận không khớp')
      }

      // Mock API call - replace with real API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful registration
      user.value = {
        id: '1',
        email: credentials.email,
        name: credentials.name,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + credentials.name,
      }

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize from localStorage
  const initAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Failed to parse stored user:', err)
        localStorage.removeItem('user')
      }
    }
  }

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,

    // Actions
    login,
    register,
    logout,
    clearError,
    initAuth,
  }
})
