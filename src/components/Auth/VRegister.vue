<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import type { RegisterRequestDto } from '@/types/auth'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'switch-to-login'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()
const auth = useAuthStore()

// Form state
const form = ref<RegisterRequestDto>({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const agreeTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Form validation
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const isFormValid = computed(() => {
  return (
    form.value.fullName &&
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    !nameError.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value &&
    agreeTerms.value
  )
})

// Validation functions
const validateName = (name: string) => {
  if (!name) {
    nameError.value = t('auth.name') + ' ' + t('auth.required')
  } else if (name.length < 2) {
    nameError.value = t('auth.nameTooShort')
  } else {
    nameError.value = ''
  }
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) {
    emailError.value = t('auth.email') + ' ' + t('auth.required')
  } else if (!emailRegex.test(email)) {
    emailError.value = t('auth.invalidEmail')
  } else {
    emailError.value = ''
  }
}

const validatePassword = (password: string) => {
  if (!password) {
    passwordError.value = t('auth.password') + ' ' + t('auth.required')
  } else if (password.length < 6) {
    passwordError.value = t('auth.passwordTooShort')
  } else {
    passwordError.value = ''
  }
}

const validateConfirmPassword = (confirmPassword: string) => {
  if (!confirmPassword) {
    confirmPasswordError.value = t('auth.confirmPassword') + ' ' + t('auth.required')
  } else if (confirmPassword !== form.value.password) {
    confirmPasswordError.value = t('auth.passwordsDoNotMatch')
  } else {
    confirmPasswordError.value = ''
  }
}

// Form handlers
const handleNameBlur = () => {
  validateName(form.value.fullName)
}

const handleEmailBlur = () => {
  validateEmail(form.value.email)
}

const handlePasswordBlur = () => {
  validatePassword(form.value.password)
  // Re-validate confirm password if it has a value
  if (form.value.confirmPassword) {
    validateConfirmPassword(form.value.confirmPassword!)
  }
}

const handleConfirmPasswordBlur = () => {
  validateConfirmPassword(form.value.confirmPassword!)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleSubmit = async () => {
  // Validate form
  validateName(form.value.fullName)
  validateEmail(form.value.email)
  validatePassword(form.value.password)
  validateConfirmPassword(form.value.confirmPassword!)

  if (!isFormValid.value) return

  try {
    await auth.register(form.value)
    emit('close')
    // Reset form
    form.value = { fullName: '', email: '', password: '', confirmPassword: '' }
    nameError.value = ''
    emailError.value = ''
    passwordError.value = ''
    confirmPasswordError.value = ''
    agreeTerms.value = false
  } catch (error) {
    // Error is handled by the auth store
    console.error(error)
  }
}

const handleClose = () => {
  emit('close')
  // Reset form and errors
  form.value = { fullName: '', email: '', password: '', confirmPassword: '' }
  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
  agreeTerms.value = false
  auth.clearError()
}

const switchToLogin = () => {
  emit('switch-to-login')
  handleClose()
}

// Prevent body scroll when dialog is open
const preventBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}

const restoreBodyScroll = () => {
  document.body.style.overflow = ''
}

// Watch for dialog open/close state
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      preventBodyScroll()
    } else {
      restoreBodyScroll()
    }
  },
)

// Cleanup on unmount
onUnmounted(() => {
  restoreBodyScroll()
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-[2px]"
      @click="handleClose"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="isOpen"
          class="w-full max-w-md mx-4 bg-secondary rounded-xl shadow-2xl border border-border-primary"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-border-primary">
            <div>
              <h2 class="text-2xl font-bold text-text-primary">{{ t('auth.register.title') }}</h2>
              <p class="text-sm text-text-secondary mt-1">{{ t('auth.register.description') }}</p>
            </div>
            <button
              @click="handleClose"
              class="text-text-muted hover:text-text-primary transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <!-- Error Message -->
            <div v-if="auth.error" class="p-3 bg-error/10 border border-error/30 rounded-lg">
              <p class="text-sm text-error">{{ auth.error }}</p>
            </div>

            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-medium text-text-primary mb-1">
                {{ t('auth.name') }}
              </label>
              <input
                id="name"
                v-model="form.fullName"
                type="text"
                :placeholder="t('auth.namePlaceholder')"
                class="w-full px-3 py-2 bg-accent border border-border-primary rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors duration-200 text-text-primary placeholder-text-muted"
                :class="{ 'border-error': nameError }"
                @blur="handleNameBlur"
              />
              <p v-if="nameError" class="text-sm text-error mt-1">{{ nameError }}</p>
            </div>

            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-text-primary mb-1">
                {{ t('auth.email') }}
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                :placeholder="t('auth.emailPlaceholder')"
                class="w-full px-3 py-2 bg-accent border border-border-primary rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors duration-200 text-text-primary placeholder-text-muted"
                :class="{ 'border-error': emailError }"
                @blur="handleEmailBlur"
              />
              <p v-if="emailError" class="text-sm text-error mt-1">{{ emailError }}</p>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-text-primary mb-1">
                {{ t('auth.password') }}
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="t('auth.passwordPlaceholder')"
                  class="w-full px-3 py-2 pr-10 bg-accent border border-border-primary rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors duration-200 text-text-primary placeholder-text-muted"
                  :class="{ 'border-error': passwordError }"
                  @blur="handlePasswordBlur"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors duration-200"
                >
                  <svg
                    v-if="showPassword"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
              <p v-if="passwordError" class="text-sm text-error mt-1">{{ passwordError }}</p>
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-text-primary mb-1">
                {{ t('auth.confirmPassword') }}
              </label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword!"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :placeholder="t('auth.confirmPasswordPlaceholder')"
                  class="w-full px-3 py-2 pr-10 bg-accent border border-border-primary rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors duration-200 text-text-primary placeholder-text-muted"
                  :class="{ 'border-error': confirmPasswordError }"
                  @blur="handleConfirmPasswordBlur"
                />
                <button
                  type="button"
                  @click="toggleConfirmPasswordVisibility"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors duration-200"
                >
                  <svg
                    v-if="showConfirmPassword"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
              <p v-if="confirmPasswordError" class="text-sm text-red-600 mt-1">
                {{ confirmPasswordError }}
              </p>
            </div>

            <!-- Terms Agreement -->
            <div class="flex items-start">
              <input
                id="agreeTerms"
                v-model="agreeTerms"
                type="checkbox"
                class="w-4 h-4 text-brand-blue border-border-primary rounded focus:ring-brand-blue bg-accent mt-1"
              />
              <label for="agreeTerms" class="ml-2 text-sm text-text-primary">
                {{ t('auth.agreeTerms') }}
                <a
                  href="#"
                  class="text-brand-blue hover:text-brand-cyan transition-colors duration-200"
                >
                  {{ t('auth.termsOfService') }}
                </a>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!isFormValid || auth.isLoading"
              class="w-full py-2 px-4 bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 text-text-primary rounded-lg focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="auth.isLoading" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ t('auth.registering') }}
              </span>
              <span v-else>{{ t('auth.register.title') }}</span>
            </button>

            <!-- Switch to Login -->
            <div class="text-center">
              <p class="text-sm text-text-secondary">
                {{ t('auth.haveAccount') }}
                <button
                  type="button"
                  @click="switchToLogin"
                  class="text-brand-blue hover:text-brand-cyan font-medium transition-colors duration-200"
                >
                  {{ t('auth.login.title') }}
                </button>
              </p>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
