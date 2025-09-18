<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LANGUAGE } from '@/constants/language'
import { ref, onMounted, onUnmounted } from 'vue'
import { saveLocaleToStorage, type SupportedLocale } from '@/utils/language'

const { t, locale } = useI18n()

const language = ref(LANGUAGE)
const isOpen = ref(false)
const popoverRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLElement | null>(null)

const togglePopover = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (langCode: string) => {
  if (langCode === 'en' || langCode === 'vi') {
    locale.value = langCode
    saveLocaleToStorage(langCode as SupportedLocale)
    isOpen.value = false
  }
}

// Close popover when clicking outside
const handleClickOutside = (event: Event) => {
  if (
    popoverRef.value &&
    buttonRef.value &&
    !popoverRef.value.contains(event.target as Node) &&
    !buttonRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative">
    <button
      ref="buttonRef"
      @click="togglePopover"
      class="relative inline-flex items-center gap-2 text-text-secondary transition-colors bg-secondary border border-border-primary rounded-xl hover:text-text-primary h-10 pl-2 pr-3 hover:bg-accent"
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
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Popover -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        ref="popoverRef"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border-primary z-50"
      >
        <div class="py-2 flex flex-col gap-1">
          <div
            v-for="(lang, code) in language"
            :key="code"
            @click="selectLanguage(code)"
            class="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-accent hover:text-text-primary cursor-pointer transition-colors mx-2 rounded-lg"
            :class="{
              'bg-accent text-text-primary': locale === code,
            }"
          >
            <span
              class="inline-flex h-6 w-6 overflow-hidden rounded-full border border-border-primary bg-secondary"
            >
              <img :src="lang.image" :alt="t(lang.name)" class="h-full w-full object-cover" />
              <span
                v-if="!lang.image"
                class="m-auto text-[8px] font-semibold uppercase text-text-muted"
              >
                {{ code }}
              </span>
            </span>
            <span class="font-medium">{{ t(lang.name) }}</span>
            <span class="ml-auto text-xs uppercase text-text-muted">{{ code }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped></style>
