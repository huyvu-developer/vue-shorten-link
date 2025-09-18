<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import LanguageButton from './Partials/LanguageButton.vue'
import Login from '@/components/Auth/VLogin.vue'
import Register from '@/components/Auth/VRegister.vue'
import { APP_NAME } from '@/constants/env'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const auth = useAuthStore()
const isScrolled = ref(false)
const showLoginDialog = ref(false)
const showRegisterDialog = ref(false)
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const router = useRouter()
let scrollTimeout: number | null = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
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
  showUserMenu.value = false
}

const toggleUserMenu = async () => {
  showUserMenu.value = !showUserMenu.value
  if (showUserMenu.value) {
    await nextTick()
    // Focus the first menu item for accessibility
    const firstMenuItem = userMenuRef.value?.querySelector('button')
    firstMenuItem?.focus()
  }
}

const handleClickOutside = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

const goToProfile = () => {
  router.push('/me')
  showUserMenu.value = false
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
          class="text-3xl font-bold transition-colors duration-300 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-brand-blue"
        >
          {{ APP_NAME }}
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <LanguageButton />
        <!-- Auth Buttons -->
        <div v-if="!auth.isAuthenticated" class="flex items-center gap-2">
          <button
            @click="openLoginDialog"
            class="px-4 py-2 rounded-xl transition-all duration-300 bg-secondary border border-border-primary text-text-secondary hover:text-text-primary cursor-pointer"
          >
            <span class="text-sm">{{ t('header.login') }}</span>
          </button>
        </div>

        <!-- User Menu -->
        <div v-else class="relative" ref="userMenuRef">
          <button
            @click="toggleUserMenu"
            class="relative inline-flex items-center gap-2 text-text-secondary transition-colors bg-secondary border border-border-primary rounded-full hover:text-text-primary h-10 pl-2 pr-3 hover:bg-accent"
            :aria-expanded="showUserMenu"
            aria-haspopup="true"
          >
            <span
              class="inline-flex h-7 w-7 overflow-hidden rounded-full border border-border-primary bg-secondary"
            >
              <img
                :src="auth.user?.avatar || '/images/avatar-default.png'"
                :alt="auth.user?.fullName || 'Avatar'"
                class="h-full w-full object-cover"
              />
            </span>
            <span class="text-sm font-medium">{{ auth.user?.fullName || 'User' }}</span>
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': showUserMenu }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border-primary z-50"
              role="menu"
              aria-orientation="vertical"
            >
              <div class="py-2 flex flex-col gap-1">
                <!-- User Info -->
                <div class="px-4 py-3 border-b border-border-primary">
                  <p class="text-sm font-medium text-text-primary">
                    {{ auth.user?.fullName || 'User' }}
                  </p>
                  <p class="text-xs text-text-muted">
                    {{ auth.user?.email || '' }}
                  </p>
                </div>

                <!-- Menu Items -->
                <button
                  @click="goToProfile"
                  class="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-accent hover:text-text-primary cursor-pointer transition-colors mx-2 rounded-lg"
                  role="menuitem"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span class="font-medium">{{ t('header.profile') }}</span>
                </button>

                <button
                  @click="logout"
                  class="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors mx-2 rounded-lg"
                  role="menuitem"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span class="font-medium">{{ t('header.logout') }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
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
