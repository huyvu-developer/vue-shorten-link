<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LDashboard from '@/layouts/LDashboard.vue'
import shortLinkService from '@/services/short-link'
import QRDialog from '@/components/common/VQRDialog.vue'
const { t } = useI18n()

import { computed, onMounted, ref } from 'vue'
import type { ShortLink } from '@/types/short-link'

const columns = computed(() => [
  {
    key: 'shortUrl',
    label: t('shortLinks.table.headers.shortLink'),
  },
  {
    key: 'originalUrl',
    label: t('shortLinks.table.headers.originalLink'),
  },
  {
    key: 'shortCode',
    label: t('shortLinks.table.headers.shortCode'),
  },
  {
    key: 'qrCode',
    label: t('shortLinks.table.headers.qrCode'),
  },
  {
    key: 'clickCount',
    label: t('shortLinks.table.headers.clickCount'),
  },
  {
    key: 'createdAt',
    label: t('shortLinks.table.headers.createdAt'),
  },
])

const linkList = ref<ShortLink[]>([])

const fetchLinkList = async () => {
  try {
    const rs = await shortLinkService.me()
    linkList.value = rs.data
  } catch (error) {
    console.error('Error fetching link list:', error)
  }
}

onMounted(() => {
  fetchLinkList()
})

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Pagination logic
const totalItems = computed(() => linkList.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

const paginatedLinks = computed(() => {
  return linkList.value.slice(startIndex.value, endIndex.value)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const getPageNumbers = computed(() => {
  const pages = []
  const maxVisiblePages = 5

  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, start + maxVisiblePages - 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

// Helper functions
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // You can add a toast notification here
    console.log('Copied to clipboard:', text)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

// QR Dialog state
const isQRDialogOpen = ref(false)
const selectedLink = ref<ShortLink | null>(null)

const generateQRCode = (link: ShortLink) => {
  selectedLink.value = link
  isQRDialogOpen.value = true
}

const closeQRDialog = () => {
  isQRDialogOpen.value = false
  selectedLink.value = null
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <LDashboard :pageTitle="t('sidebar.shortLinks')">
    <!-- Header Section -->
    <!-- Table Container -->
    <div class="w-full rounded-2xl border border-gray-800 bg-white/[0.03] overflow-hidden">
      <!-- Table Header -->
      <div class="px-5 py-4 border-b border-gray-800 bg-gray-800/50 md:px-6">
        <h2 class="text-lg font-semibold text-white/90">
          {{ t('shortLinks.pageTitle') }}
        </h2>
        <p class="text-sm text-gray-400 mt-1">{{ totalItems }} {{ t('shortLinks.totalLinks') }}</p>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-800/30">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-5 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider md:px-6"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white/[0.03] divide-y divide-gray-800">
            <tr
              v-for="(link, index) in paginatedLinks"
              :key="index"
              class="hover:bg-gray-800/50 transition-colors duration-150"
            >
              <td v-for="column in columns" :key="column.key" class="px-5 py-3 md:px-6">
                <div class="flex items-center">
                  <!-- Short URL -->
                  <div v-if="column.key === 'shortUrl'" class="flex items-center space-x-2">
                    <div class="flex-1 min-w-0">
                      <a
                        :href="link.shortUrl"
                        target="_blank"
                        class="text-sm font-medium text-blue-400 hover:text-blue-300 truncate block"
                      >
                        {{ link.shortUrl }}
                      </a>
                    </div>
                    <button
                      @click="copyToClipboard(link.shortUrl)"
                      class="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                      :title="t('shortLinks.actions.copy')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- Original URL -->
                  <div v-else-if="column.key === 'originalUrl'" class="flex-1 min-w-0 max-w-50">
                    <a
                      :href="link.originalUrl"
                      target="_blank"
                      class="text-sm text-gray-100 hover:text-blue-400 truncate block"
                    >
                      {{ link.originalUrl }}
                    </a>
                  </div>

                  <!-- Short Code -->
                  <div v-else-if="column.key === 'shortCode'" class="flex items-center space-x-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300"
                    >
                      {{ link.shortCode }}
                    </span>
                  </div>

                  <!-- QR Code -->
                  <div v-else-if="column.key === 'qrCode'" class="flex items-center">
                    <button
                      @click="generateQRCode(link)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-600 rounded-md text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
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
                      {{ t('shortLinks.actions.generateQR') }}
                    </button>
                  </div>

                  <!-- Click Count -->
                  <div v-else-if="column.key === 'clickCount'" class="flex items-center">
                    <span class="text-sm font-medium text-gray-100">
                      {{ link.clickCount || 0 }}
                    </span>
                    <span class="ml-1 text-xs text-gray-400">{{
                      t('shortLinks.table.clicks')
                    }}</span>
                  </div>

                  <!-- Created At -->
                  <div v-else-if="column.key === 'createdAt'" class="text-sm text-gray-400">
                    {{ formatDate(link.createdAt) }}
                  </div>

                  <!-- Default -->
                  <div v-else class="text-sm text-gray-100">
                    {{ link[column.key as keyof typeof link] }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-gray-800/30 px-5 py-4 border-t border-gray-800 md:px-6">
        <div class="flex items-center justify-between">
          <!-- Pagination Info -->
          <div class="flex items-center text-sm text-gray-300">
            <span class="font-medium">
              {{
                t('shortLinks.pagination.showing', {
                  start: startIndex + 1,
                  end: Math.min(endIndex, totalItems),
                  total: totalItems,
                })
              }}
            </span>
          </div>

          <!-- Pagination Controls -->
          <div class="flex items-center space-x-1">
            <!-- Previous Button -->
            <button
              @click="goToPreviousPage"
              :disabled="currentPage === 1"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {{ t('shortLinks.pagination.previous') }}
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center space-x-1">
              <button
                v-for="page in getPageNumbers"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  page === currentPage
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:text-white',
                ]"
              >
                {{ page }}
              </button>
            </div>

            <!-- Next Button -->
            <button
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ t('shortLinks.pagination.next') }}
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Dialog -->
    <QRDialog
      :is-open="isQRDialogOpen"
      :url="selectedLink?.shortUrl || ''"
      :short-code="selectedLink?.shortCode || ''"
      :title="t('shortLinks.qrDialog.title')"
      @close="closeQRDialog"
    />
  </LDashboard>
</template>

<style lang="scss" scoped></style>
