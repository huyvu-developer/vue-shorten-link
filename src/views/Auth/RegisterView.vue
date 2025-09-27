<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
// import { useI18n } from 'vue-i18n' // Not used currently
import { useAuthStore } from '@/stores/auth'
import LBlank from '@/layouts/LBlank.vue'
import VGridShape from '@/components/common/VGridShape.vue'
import type { RegisterRequest } from '@/types/auth'
import { Icon } from '@iconify/vue'

const router = useRouter()
// const { t } = useI18n() // Removed as not currently used
const auth = useAuthStore()

// Form state
const form = reactive<RegisterRequest>({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const agreeToTerms = ref(false)

const error = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const isFormValid = computed(() => {
  return (
    form.fullName &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    !error.fullName &&
    !error.email &&
    !error.password &&
    !error.confirmPassword &&
    agreeToTerms.value
  )
})

// Validation functions
const validateName = (name: string) => {
  if (!name) {
    error.fullName = 'Họ tên là bắt buộc'
  } else if (name.length < 2) {
    error.fullName = 'Họ tên phải có ít nhất 2 ký tự'
  } else {
    error.fullName = ''
  }
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) {
    error.email = 'Email là bắt buộc'
  } else if (!emailRegex.test(email)) {
    error.email = 'Email không hợp lệ'
  } else {
    error.email = ''
  }
}

const validatePassword = (password: string, confirmPassword: string) => {
  if (!password) {
    error.password = 'Mật khẩu là bắt buộc'
  } else if (password.length < 6) {
    error.password = 'Mật khẩu phải có ít nhất 6 ký tự'
  } else if (password !== confirmPassword) {
    error.password = 'Mật khẩu không khớp'
  } else {
    error.password = ''
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  // Validate form
  validateName(form.fullName)
  validateEmail(form.email)
  validatePassword(form.password, form.confirmPassword!)

  if (!isFormValid.value) return

  try {
    await auth.register(form)
    router.push('/signin')
  } catch (error) {
    console.error('Registration error:', error)
  }
}
</script>

<template>
  <l-blank>
    <div class="relative p-6 bg-gray-900 z-1 sm:p-0">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row bg-gray-900">
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
            <router-link
              to="/"
              class="inline-flex items-center text-sm text-gray-400 transition-colors hover:text-gray-300"
            >
              <Icon icon="material-symbols:arrow-back-ios-new-rounded" />
              <span class="ml-3">Back</span>
            </router-link>
          </div>
          <!-- Form -->
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div class="mb-5 sm:mb-8">
              <h1 class="mb-2 font-semibold text-white/90 text-title-sm sm:text-title-md text-2xl">
                Sign Up
              </h1>
              <p class="text-sm text-gray-400">Enter your email and password to sign up!</p>
            </div>
            <div>
              <!-- <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                <button
                  class="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Sign up with Google
                </button>
                <button
                  class="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                >
                  <svg
                    width="21"
                    class="fill-current"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z"
                    />
                  </svg>

                  Sign up with X
                </button>
              </div>
              <div class="relative py-3 sm:py-5">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2"
                    >Or</span
                  >
                </div>
              </div> -->
              <form @submit.prevent="handleSubmit">
                <!-- Error Message -->
                <div
                  v-if="auth.error"
                  class="mb-5 p-3 bg-red-900/20 border border-red-800/30 rounded-lg"
                >
                  <p class="text-sm text-red-400">{{ auth.error }}</p>
                </div>

                <div class="space-y-5">
                  <div class="grid grid-cols-1 gap-5 sm:grid-cols-1">
                    <!-- First Name -->
                    <div class="sm:col-span-1">
                      <label for="fname" class="mb-1.5 block text-sm font-medium text-gray-400">
                        First Name<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="form.fullName"
                        type="text"
                        id="fname"
                        name="fname"
                        placeholder="Enter your first name"
                        class="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white/90 shadow-theme-xs placeholder:text-white/30 focus:border-brand-800 focus:outline-hidden focus:ring-1 focus:ring-brand-500/10"
                        :class="{ 'border-red-500': error.fullName }"
                      />
                    </div>
                    <!-- Last Name -->
                    <!-- <div class="sm:col-span-1">
                      <label for="lname" class="mb-1.5 block text-sm font-medium text-gray-400">
                        Last Name<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="form.fullName"
                        type="text"
                        id="lname"
                        name="lname"
                        placeholder="Enter your last name"
                        class="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white/90 shadow-theme-xs placeholder:text-white/30 focus:border-brand-800 focus:outline-hidden focus:ring-1 focus:ring-brand-500/10"
                        :class="{ 'border-red-500': error.fullName }"
                      />
                    </div> -->
                  </div>
                  <p v-if="error.fullName" class="text-xs text-red-400 mt-1">
                    {{ error.fullName }}
                  </p>
                  <!-- Email -->
                  <div>
                    <label
                      for="email"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      Email<span class="text-error-500">*</span>
                    </label>
                    <input
                      v-model="form.email"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      class="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white/90 shadow-theme-xs placeholder:text-white/30 focus:border-brand-800 focus:outline-hidden focus:ring-1 focus:ring-brand-500/10"
                      :class="{ 'border-red-500': error.email }"
                    />
                    <p v-if="error.email" class="text-xs text-red-400 mt-1">
                      {{ error.email }}
                    </p>
                  </div>
                  <!-- Password -->
                  <div>
                    <label
                      for="password"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      Password<span class="text-error-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        id="password"
                        placeholder="Enter your password"
                        class="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 py-2.5 pl-4 pr-11 text-sm text-white/90 shadow-theme-xs placeholder:text-white/30 focus:border-brand-800 focus:outline-hidden focus:ring-1 focus:ring-brand-500/10"
                        :class="{ 'border-red-500': error.password }"
                      />
                      <span
                        @click="togglePasswordVisibility"
                        class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                      >
                        <Icon
                          v-if="!showPassword"
                          icon="material-symbols:visibility-outline"
                          class="w-5 h-5"
                        />
                        <Icon
                          v-else
                          icon="material-symbols:visibility-off-outline"
                          class="w-5 h-5"
                        />
                      </span>
                    </div>
                    <p v-if="error.password" class="text-xs text-red-400 mt-1">
                      {{ error.password }}
                    </p>
                  </div>
                  <!-- Confirm Password -->
                  <div>
                    <label
                      for="confirmPassword"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      Confirm Password<span class="text-error-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.confirmPassword"
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        class="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 py-2.5 pl-4 pr-11 text-sm text-white/90 shadow-theme-xs placeholder:text-white/30 focus:border-brand-800 focus:outline-hidden focus:ring-1 focus:ring-brand-500/10"
                        :class="{ 'border-red-500': error.confirmPassword }"
                      />
                    </div>
                    <p v-if="error.confirmPassword" class="text-xs text-red-400 mt-1">
                      {{ error.confirmPassword }}
                    </p>
                  </div>
                  <!-- Checkbox -->
                  <div>
                    <div>
                      <label
                        for="checkboxLabelOne"
                        class="flex items-start text-sm font-normal text-gray-400 cursor-pointer select-none"
                      >
                        <div class="relative">
                          <input
                            v-model="agreeToTerms"
                            type="checkbox"
                            id="checkboxLabelOne"
                            class="sr-only"
                          />
                          <div
                            :class="
                              agreeToTerms
                                ? 'border-brand-500 bg-brand-500'
                                : 'bg-transparent border-gray-700'
                            "
                            class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]"
                          >
                            <span :class="agreeToTerms ? '' : 'opacity-0'">
                              <Icon icon="material-symbols:check" class="w-3.5 h-3.5 text-white" />
                            </span>
                          </div>
                        </div>
                        <p class="inline-block font-normal text-gray-400">
                          By creating an account means you agree to the
                          <span class="text-white/90"> Terms and Conditions, </span>
                          and our
                          <span class="text-white"> Privacy Policy </span>
                        </p>
                      </label>
                    </div>
                  </div>
                  <!-- Button -->
                  <div>
                    <button
                      type="submit"
                      :disabled="!isFormValid || auth.isLoading"
                      class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-[#465fff] shadow-theme-xs hover:bg-[#3641f5] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span v-if="auth.isLoading" class="flex items-center">
                        <Icon
                          icon="material-symbols:refresh"
                          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        />
                        Đăng ký...
                      </span>
                      <span v-else>Sign Up</span>
                    </button>
                  </div>
                </div>
              </form>
              <div class="mt-5">
                <p class="text-sm font-normal text-center text-gray-400 sm:text-start">
                  Already have an account?
                  <router-link to="/signin" class="text-brand-400 hover:text-brand-600"
                    >Sign In</router-link
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-white/5 lg:grid">
          <div class="flex items-center justify-center z-1">
            <v-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <router-link to="/" class="block mb-4">
                <!-- <img width="{231}" height="{48}" src="/images/logo/auth-logo.svg" alt="Logo" /> -->
                SLink
              </router-link>
              <p class="text-center text-white/60">Smart URL Shortener with Click Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </l-blank>
</template>
