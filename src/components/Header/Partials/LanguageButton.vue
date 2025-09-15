<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LANGUAGE } from '@/constants/language'
import { ref } from 'vue'

const { t, locale } = useI18n()

const language = ref(LANGUAGE)
</script>

<template>
  <button
    class="relative inline-flex items-center gap-2 text-text-secondary transition-colors bg-secondary border border-border-primary rounded-full hover:text-text-primary h-10 pl-2 pr-3 hover:bg-accent"
  >
    <span
      class="inline-flex h-7 w-7 overflow-hidden rounded-full border border-border-primary bg-secondary"
    >
      <img
        :src="language[locale as keyof typeof language].image"
        :alt="t(language[locale as keyof typeof language].name)"
        class="h-full w-full object-cover"
      />
      <span
        v-if="!language[locale as keyof typeof language].image"
        class="m-auto text-[10px] font-semibold uppercase text-text-muted"
        >{{ locale as string }}</span
      >
    </span>
    <span class="text-sm font-medium uppercase">{{ locale as string }}</span>
  </button>
</template>

<style lang="scss" scoped></style>
