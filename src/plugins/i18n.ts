import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import vi from '@/locales/vi.json'
import { getSavedLocale, saveLocaleToStorage } from '@/utils/language'

const messages = {
  en,
  vi,
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages,
})

// Re-export the utility functions for convenience
export { saveLocaleToStorage }

export default i18n
