/**
 * Language utility functions for managing locale persistence
 */

export const LANGUAGE_STORAGE_KEY = 'app-locale'
export const SUPPORTED_LOCALES = ['en', 'vi'] as const
export const DEFAULT_LOCALE = 'en'

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/**
 * Get the saved locale from localStorage
 * @returns The saved locale or default locale if none saved
 */
export const getSavedLocale = (): SupportedLocale => {
  try {
    if (typeof window === 'undefined') {
      return DEFAULT_LOCALE
    }

    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return saved && SUPPORTED_LOCALES.includes(saved as SupportedLocale)
      ? (saved as SupportedLocale)
      : DEFAULT_LOCALE
  } catch (error) {
    console.warn('Failed to get saved locale from localStorage:', error)
    return DEFAULT_LOCALE
  }
}

/**
 * Save the locale to localStorage
 * @param locale The locale to save
 */
export const saveLocaleToStorage = (locale: SupportedLocale): void => {
  try {
    if (typeof window === 'undefined') {
      return
    }

    if (SUPPORTED_LOCALES.includes(locale)) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, locale)
    } else {
      console.warn(`Invalid locale: ${locale}. Supported locales: ${SUPPORTED_LOCALES.join(', ')}`)
    }
  } catch (error) {
    console.warn('Failed to save locale to localStorage:', error)
  }
}

/**
 * Clear the saved locale from localStorage
 */
export const clearSavedLocale = (): void => {
  try {
    if (typeof window === 'undefined') {
      return
    }

    localStorage.removeItem(LANGUAGE_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear saved locale from localStorage:', error)
  }
}
