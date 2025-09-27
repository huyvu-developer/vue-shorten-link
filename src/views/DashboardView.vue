<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LDashboard from '@/layouts/LDashboard.vue'
import shortLinkService from '@/services/short-link'
import QRDialog from '@/components/common/VQRDialog.vue'
const { t } = useI18n()

import { computed, onMounted, ref } from 'vue'
import type { ShortLink } from '@/types/short-link'
import VBreadcrumb from '@/components/common/VBreadcrumb.vue'

const columns = computed(() => [
  {
    key: 'shortUrl',
    label: t('homepage.table.headers.shortLink'),
  },
  {
    key: 'originalUrl',
    label: t('homepage.table.headers.originalLink'),
  },
  {
    key: 'shortCode',
    label: t('homepage.table.headers.shortCode'),
  },
  {
    key: 'qrCode',
    label: t('homepage.table.headers.qrCode'),
  },
  {
    key: 'clickCount',
    label: t('homepage.table.headers.clickCount'),
  },
  // {
  //   key: 'expiresAt',
  //   label: t('homepage.table.headers.expiresAt'),
  // },
  {
    key: 'createdAt',
    label: t('homepage.table.headers.createdAt'),
  },
  // {
  //   key: 'status',
  //   label: t('homepage.table.headers.status'),
  // },
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
const itemsPerPage = ref(10)

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
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <LDashboard>
    <!-- Header Section -->

    <v-breadcrumb :pageTitle="t('sidebar.dashboard')" />

    <!-- Table Container -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <!-- Table Header -->
      <div
        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
      >
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Your Links</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ totalItems }} total links</p>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700/30">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(link, index) in paginatedLinks"
              :key="index"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
            >
              <td v-for="column in columns" :key="column.key" class="p-3">
                <div class="flex items-center">
                  <!-- Short URL -->
                  <div v-if="column.key === 'shortUrl'" class="flex items-center space-x-2">
                    <div class="flex-1 min-w-0">
                      <a
                        :href="link.shortUrl"
                        target="_blank"
                        class="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate block"
                      >
                        {{ link.shortUrl }}
                      </a>
                    </div>
                    <button
                      @click="copyToClipboard(link.shortUrl)"
                      class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Copy link"
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
                      class="text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                    >
                      {{ link.originalUrl }}
                    </a>
                  </div>

                  <!-- Short Code -->
                  <div v-else-if="column.key === 'shortCode'" class="flex items-center space-x-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {{ link.shortCode }}
                    </span>
                  </div>

                  <!-- QR Code -->
                  <div v-else-if="column.key === 'qrCode'" class="flex items-center">
                    <button
                      @click="generateQRCode(link)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
                      QR
                    </button>
                  </div>

                  <!-- Click Count -->
                  <div v-else-if="column.key === 'clickCount'" class="flex items-center">
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ link.clickCount || 0 }}
                    </span>
                    <span class="ml-1 text-xs text-gray-500 dark:text-gray-400">clicks</span>
                  </div>

                  <!-- Created At -->
                  <div
                    v-else-if="column.key === 'createdAt'"
                    class="text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ formatDate(link.createdAt) }}
                  </div>

                  <!-- Default -->
                  <div v-else class="text-sm text-gray-900 dark:text-gray-100">
                    {{ link[column.key as keyof typeof link] }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <!-- Pagination Info -->
          <div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <span class="font-medium">
              {{
                t('homepage.pagination.showing', {
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
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {{ t('homepage.pagination.previous') }}
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
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                ]"
              >
                {{ page }}
              </button>
            </div>

            <!-- Next Button -->
            <button
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {{ t('homepage.pagination.next') }}
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
      title="QR Code"
      @close="closeQRDialog"
    />
  </LDashboard>
</template>

<style lang="scss" scoped></style>
