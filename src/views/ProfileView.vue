<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LDashboard from '@/layouts/LDashboard.vue'
const { t } = useI18n()
</script>

<template>
  <LDashboard>
    <!-- URL History Table -->
    <section class="relative mt-10 z-10 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div class="w-full max-w-7xl">
        <div
          class="rounded-2xl overflow-hidden shadow-2xl bg-secondary border border-border-primary"
        >
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-border-primary bg-secondary">
            <h3 class="text-xl font-semibold text-text-primary">
              {{ t('homepage.table.title') }}
            </h3>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-accent">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider text-text-secondary"
                  >
                    {{ t('homepage.table.headers.shortLink') }}
                  </th>
                  <th
                    class="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider text-text-secondary"
                  >
                    {{ t('homepage.table.headers.originalLink') }}
                  </th>
                  <th
                    class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-text-secondary"
                  >
                    {{ t('homepage.table.headers.qrCode') }}
                  </th>
                  <th
                    class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-text-secondary"
                  >
                    {{ t('homepage.table.headers.clicks') }}
                  </th>
                  <th
                    class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-text-secondary"
                  >
                    {{ t('homepage.table.headers.status') }}
                  </th>
                  <th
                    class="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider text-text-secondary"
                  >
                    {{ t('homepage.table.headers.date') }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y bg-secondary border-border-primary">
                <tr
                  v-for="item in urlHistory"
                  :key="item.id"
                  class="transition-colors hover:bg-accent"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center justify-between">
                      <span class="text-sm truncate max-w-[200px] text-text-primary">
                        {{ item.shortLink }}
                      </span>
                      <button
                        class="transition-colors flex-shrink-0 ml-2 text-brand-blue hover:text-text-primary"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path
                            d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM14 7a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm truncate max-w-[300px] block text-text-secondary">
                      {{ item.originalLink }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <div class="text-sm text-text-secondary">QR</div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="text-sm text-text-primary">
                      {{ item.clicks.toLocaleString() }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <span
                        class="text-sm"
                        :class="item.status === 'active' ? 'text-success' : 'text-error'"
                      >
                        {{ t(`homepage.table.status.${item.status}`) }}
                      </span>
                      <svg
                        :class="item.status === 'active' ? 'text-success' : 'text-error'"
                        class="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          v-if="item.status === 'active'"
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                        <path
                          v-else
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm text-text-secondary">{{ item.date }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Table Footer -->
          <div class="px-6 py-4 border-t border-border-primary bg-secondary">
            <p class="text-sm text-center text-text-secondary">
              {{ t('homepage.table.footer') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </LDashboard>
</template>

<style lang="scss" scoped></style>
