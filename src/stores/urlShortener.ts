import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { urlShortenerApi, type ShortenUrlResponse } from '@/services/api'

export interface ShortenedUrl {
  id: string
  originalUrl: string
  shortUrl: string
  createdAt: string
  clickCount: number
}

export const useUrlShortenerStore = defineStore('urlShortener', () => {
  const { t } = useI18n()

  // State
  const urls = ref<ShortenedUrl[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const inputUrl = ref('')

  // Getters
  const recentUrls = computed(() => urls.value.slice(0, 5))
  const totalUrls = computed(() => urls.value.length)

  // Actions
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const shortenUrl = async (url: string): Promise<void> => {
    if (!validateUrl(url)) {
      error.value = t('shortener.error.invalidUrl')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      // Try to use real API first, fallback to mock if not available
      let response: ShortenUrlResponse

      try {
        response = await urlShortenerApi.shortenUrl({ url })
      } catch (apiError) {
        // If API is not available, use mock for demo purposes
        console.warn('API not available, using mock service:', apiError)
        response = await mockShortenUrl(url)
      }

      const newUrl: ShortenedUrl = {
        id: response.id,
        originalUrl: response.originalUrl,
        shortUrl: response.shortUrl,
        createdAt: response.createdAt,
        clickCount: response.clickCount,
      }

      urls.value.unshift(newUrl)
      inputUrl.value = ''
    } catch (err) {
      error.value = t('shortener.error.networkError')
      console.error('Error shortening URL:', err)
    } finally {
      isLoading.value = false
    }
  }

  const mockShortenUrl = async (url: string): Promise<ShortenUrlResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a mock short URL
    const shortCode = Math.random().toString(36).substring(2, 8)
    const shortUrl = `${window.location.origin}/${shortCode}`

    return {
      id: Date.now().toString(),
      originalUrl: url,
      shortUrl,
      shortCode,
      createdAt: new Date().toISOString(),
      clickCount: 0,
    }
  }

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      return false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearUrls = () => {
    urls.value = []
  }

  return {
    // State
    urls,
    isLoading,
    error,
    inputUrl,

    // Getters
    recentUrls,
    totalUrls,

    // Actions
    shortenUrl,
    copyToClipboard,
    clearError,
    clearUrls,
  }
})
