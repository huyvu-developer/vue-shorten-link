<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import QRCode from 'qrcode'

interface Props {
  isOpen: boolean
  title?: string
  url: string
  shortCode?: string
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'QR Code',
  shortCode: '',
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

const qrCodeDataUrl = ref('')
const isGeneratingQr = ref(false)

// Generate QR code when dialog opens
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen && props.url) {
      await generateQRCode()
    }
  },
)

const generateQRCode = async () => {
  if (!props.url) return

  isGeneratingQr.value = true

  try {
    const qrDataUrl = await QRCode.toDataURL(props.url, {
      width: 300,
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

const downloadQRCode = () => {
  if (!qrCodeDataUrl.value) return

  try {
    const link = document.createElement('a')
    link.href = qrCodeDataUrl.value
    link.download = `qr-code-${props.shortCode || 'link'}.png`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Failed to download QR code:', error)
  }
}

const closeDialog = () => {
  emit('close')
}
</script>

<template>
  <!-- Dialog Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click="closeDialog"
  >
    <!-- Dialog Content -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4" @click.stop>
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <button
          @click="closeDialog"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Loading State -->
        <div v-if="isGeneratingQr" class="text-center py-8">
          <div
            class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4"
          >
            <svg
              class="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin"
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
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('homepage.result.qrDialogGenerating') }}
          </p>
        </div>

        <!-- QR Code Display -->
        <div v-else-if="qrCodeDataUrl" class="text-center">
          <div class="inline-block p-4 bg-white dark:bg-gray-700 rounded-lg shadow-lg mb-4">
            <img :src="qrCodeDataUrl" alt="QR Code" class="w-64 h-64" />
          </div>

          <!-- URL Info -->
          <div class="mb-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">URL:</p>
            <p
              class="text-sm text-gray-900 dark:text-gray-100 break-all bg-gray-50 dark:bg-gray-700 p-2 rounded"
            >
              {{ url }}
            </p>
          </div>

          <!-- Download Button -->
          <button
            @click="downloadQRCode"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {{ t('homepage.result.downloadQrButton') }}
          </button>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-8">
          <div
            class="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mb-4"
          >
            <svg
              class="w-6 h-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('homepage.result.qrDialogError') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
