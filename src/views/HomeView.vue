<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import LDefault from '@/layouts/LDefault.vue'
import { APP_NAME } from '@/constants/env'
import shortLinkService from '@/services/short-link'
import type { ShortLink } from '@/types/short-link'
import QRCode from 'qrcode'

const { t } = useI18n()
const auth = useAuthStore()

const urlInput = ref('')
const shortLinkResult = ref<ShortLink | null>(null)
const qrCodeDataUrl = ref('')
const isGeneratingQr = ref(false)
const copySuccess = ref(false)
const resultSectionRef = ref<HTMLElement | null>(null)

watch(
  () => urlInput.value,
  () => {
    console.log(urlInput.value)
  },
)

const shortenUrl = async () => {
  try {
    // Validate URL input
    if (!urlInput.value.trim()) {
      console.error('URL is required')
      return
    }

    // Basic URL validation
    try {
      new URL(urlInput.value)
    } catch {
      console.error('Invalid URL format')
      return
    }

    console.log('Input URL:', urlInput.value)
    console.log('User ID:', auth.user?.id)

    const rs = await shortLinkService.create({
      originalUrl: urlInput.value.trim(),
      userId: auth.user?.id as string,
    })

    console.log('API Response:', rs)

    // Handle successful response
    if (rs && rs.statusCode === 201 && rs.data) {
      shortLinkResult.value = rs.data
      // Clear input after successful creation
      urlInput.value = ''

      // Scroll to result section after a delay to ensure DOM is updated
      setTimeout(() => {
        if (resultSectionRef.value) {
          resultSectionRef.value.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }, 300)
    }
  } catch (error) {
    console.error('Error creating short link:', error)
  }
}

const copyShortLink = async () => {
  if (!shortLinkResult.value) return

  const shortUrl = `${window.location.origin}/${shortLinkResult.value.shortCode}`

  try {
    await navigator.clipboard.writeText(shortUrl)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const generateQRCode = async () => {
  if (!shortLinkResult.value) return

  isGeneratingQr.value = true
  const shortUrl = `${window.location.origin}/${shortLinkResult.value.shortCode}`

  try {
    const qrDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    qrCodeDataUrl.value = qrDataUrl
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  } finally {
    isGeneratingQr.value = false
  }
}

const getShortUrl = () => {
  if (!shortLinkResult.value) return ''
  return `${window.location.origin}/${shortLinkResult.value.shortCode}`
}
</script>

<template>
  <LDefault>
    <main class="min-h-screen relative overflow-hidden pt-20 bg-primary">
      <!-- Hero Section -->
      <section class="relative z-10 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div class="max-w-4xl mx-auto text-center">
          <h1
            class="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight text-text-primary"
          >
            {{ t('homepage.hero.title1') }}
          </h1>
          <h2
            class="text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent mb-8 leading-tight bg-gradient-to-r from-brand-blue to-brand-cyan"
          >
            {{ t('homepage.hero.title2') }}
          </h2>
          <p class="text-xl mb-12 max-w-2xl mx-auto leading-relaxed text-text-secondary">
            {{ APP_NAME }} {{ t('homepage.hero.description') }}
          </p>

          <!-- URL Shortener -->
          <div class="rounded-2xl p-8 mb-8 shadow-2xl bg-secondary border-border-primary">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1 relative">
                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  v-model="urlInput"
                  :placeholder="$t('shortener.inputPlaceholder')"
                  type="url"
                  class="w-full pl-12 pr-4 py-5 bg-transparent border-none outline-none text-lg rounded-lg focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50 text-text-primary placeholder-text-secondary"
                />
              </div>
              <button
                @click="shortenUrl"
                class="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 px-10 py-5 text-lg font-semibold w-full sm:w-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-text-primary cursor-pointer"
              >
                {{ t('homepage.shortener.button') }}
              </button>
            </div>
          </div>

          <!-- Short Link Result -->
          <div
            ref="resultSectionRef"
            v-if="shortLinkResult"
            class="rounded-2xl p-8 mb-8 shadow-2xl bg-secondary border-border-primary"
          >
            <!-- Success Message -->
            <div class="text-center mb-6">
              <div
                class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
              >
                <svg
                  class="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-text-primary mb-2">
                {{ t('homepage.result.title') }}
              </h3>
              <p class="text-lg text-text-secondary">{{ t('homepage.result.description') }}</p>
            </div>

            <!-- Short Link Display -->
            <div class="bg-primary rounded-xl p-6 mb-6">
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1 relative">
                  <div
                    class="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    :value="getShortUrl()"
                    readonly
                    class="w-full pl-12 pr-4 py-5 bg-transparent border-none outline-none text-lg rounded-lg text-text-primary font-mono"
                  />
                </div>
                <button
                  @click="copyShortLink"
                  :class="[
                    'bg-gradient-to-r hover:from-brand-blue/90 hover:to-brand-cyan/90 px-10 py-5 text-lg font-semibold w-full sm:w-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-text-primary cursor-pointer flex items-center justify-center gap-2',
                    copySuccess ? 'from-green-500 to-green-600' : 'from-brand-blue to-brand-cyan',
                  ]"
                >
                  <svg
                    v-if="!copySuccess"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{
                    copySuccess
                      ? t('homepage.result.copiedButton')
                      : t('homepage.result.copyButton')
                  }}
                </button>
              </div>

              <!-- Original URL Info -->
              <div class="mt-4 pt-4 border-t border-border-primary">
                <p class="text-sm text-text-secondary mb-2">
                  {{ t('homepage.result.originalUrlLabel') }}
                </p>
                <p class="text-sm text-text-primary break-all">{{ shortLinkResult.originalUrl }}</p>
              </div>
            </div>

            <!-- QR Code Section -->
            <div class="text-center">
              <button
                @click="generateQRCode"
                :disabled="isGeneratingQr"
                class="bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-cyan/90 hover:to-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white flex items-center gap-3 mx-auto"
              >
                <svg
                  v-if="!isGeneratingQr"
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-6 h-6 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {{
                  isGeneratingQr
                    ? t('homepage.result.generatingQrButton')
                    : t('homepage.result.generateQrButton')
                }}
              </button>

              <!-- QR Code Display -->
              <div v-if="qrCodeDataUrl" class="mt-8">
                <div class="inline-block p-6 bg-white rounded-2xl shadow-xl">
                  <img :src="qrCodeDataUrl" alt="QR Code" class="w-48 h-48" />
                </div>
                <p class="text-lg text-text-secondary mt-4">
                  {{ t('homepage.result.qrDescription') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </LDefault>
</template>
