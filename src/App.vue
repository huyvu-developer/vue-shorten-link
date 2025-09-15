<script setup lang="ts">
import { RouterView } from 'vue-router'
// import { useI18n } from 'vue-i18n'
// import { useTheme } from '@/composables/useTheme'
// import { Button } from '@/components/ui/button'

// const { locale, availableLocales } = useI18n()
// const { isDark, toggleDark } = useTheme()

// const changeLanguage = (lang: string) => {
//   locale.value = lang
// }
</script>

<template>
  <div class="min-h-screen bg-background transition-colors duration-200">
    <main>
      <RouterView />
    </main>
  </div>
</template>
