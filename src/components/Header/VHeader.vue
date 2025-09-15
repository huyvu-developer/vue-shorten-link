<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onMounted, onUnmounted, ref } from 'vue'
import LanguageButton from './Partials/LanguageButton.vue'

const auth = useAuthStore()

const isScrolled = ref(false)
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
          Linkly
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <!-- Language Switch -->

        <button
          class="px-4 py-2 rounded-lg transition-all duration-300 bg-secondary border border-border-primary text-text-secondary hover:bg-brand-blue hover:text-text-primary"
        >
          <span class="text-sm">Login</span>
        </button>

        <LanguageButton />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped></style>
