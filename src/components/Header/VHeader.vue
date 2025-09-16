<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { onMounted, onUnmounted, ref } from 'vue'
import LanguageButton from './Partials/LanguageButton.vue'
import Login from '@/components/Auth/VLogin.vue'
import Register from '@/components/Auth/VRegister.vue'
import { APP_NAME } from '@/constants/env'

const { t } = useI18n()
const auth = useAuthStore()

const isScrolled = ref(false)
const showLoginDialog = ref(false)
const showRegisterDialog = ref(false)
let scrollTimeout: number | null = null

onMounted(() => {
  auth.initAuth()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})

const handleScroll = () => {
  // Throttle scroll events to prevent excessive updates
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }

  scrollTimeout = setTimeout(() => {
    const scrollY = window.scrollY
    // Add a small threshold to prevent rapid state changes
    isScrolled.value = scrollY > 10
  }, 10)
}

// Dialog handlers
const openLoginDialog = () => {
  showLoginDialog.value = true
}

const closeLoginDialog = () => {
  showLoginDialog.value = false
}

const closeRegisterDialog = () => {
  showRegisterDialog.value = false
}

const switchToRegister = () => {
  showLoginDialog.value = false
  showRegisterDialog.value = true
}

const switchToLogin = () => {
  showRegisterDialog.value = false
  showLoginDialog.value = true
}

const logout = () => {
  auth.logout()
}
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300 border-b',
      isScrolled
        ? 'backdrop-blur-md shadow-sm bg-primary/80 border-border-primary'
        : 'bg-transparent border-transparent',
    ]"
  >
    <div class="mx-auto flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h1
          class="text-2xl font-bold transition-colors duration-300 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-brand-blue"
        >
          {{ APP_NAME }}
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <!-- Auth Buttons -->
        <div v-if="!auth.isAuthenticated" class="flex items-center gap-2">
          <button
            @click="openLoginDialog"
            class="px-4 py-2 rounded-lg transition-all duration-300 bg-secondary border border-border-primary text-text-secondary hover:bg-brand-blue hover:text-text-primary cursor-pointer"
          >
            <span class="text-sm">{{ t('header.login') }}</span>
          </button>
        </div>

        <!-- User Menu -->
        <div v-else class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <img
              v-if="auth.user?.avatar"
              :src="auth.user.avatar"
              :alt="auth.user.fullName"
              class="w-8 h-8 rounded-full border-2 border-white"
            />
            <span class="text-sm text-text-primary hidden sm:block">{{ auth.user?.fullName }}</span>
          </div>
          <button
            @click="logout"
            class="px-4 py-2 rounded-lg transition-all duration-300 bg-red-500 text-white hover:bg-red-600 cursor-pointer"
          >
            <span class="text-sm">{{ t('header.logout') }}</span>
          </button>
        </div>

        <LanguageButton />
      </div>
    </div>
  </header>

  <!-- Auth Dialogs -->
  <Login
    :is-open="showLoginDialog"
    @close="closeLoginDialog"
    @switch-to-register="switchToRegister"
  />
  <Register
    :is-open="showRegisterDialog"
    @close="closeRegisterDialog"
    @switch-to-login="switchToLogin"
  />
</template>

<style lang="scss" scoped></style>
