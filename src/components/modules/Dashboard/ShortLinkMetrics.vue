<script setup lang="ts">
import type { Statistics } from '@/types/dashboard'
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    metrics?: Statistics | null
  }>(),
  {
    metrics: () => ({
      totalLink: 0,
      totalClick: 0,
      totalLinkExpired: 0,
    }),
  },
)

console.log(props.metrics)

const metricData = computed(() => [
  {
    title: t('dashboard.metrics.totalLinks'),
    value: props.metrics?.totalLink,
    percentage: 10,
    icon: 'material-symbols:link',
  },
  {
    title: t('dashboard.metrics.totalClicks'),
    value: props.metrics?.totalClick,
    percentage: 10,
    icon: 'mdi:cursor-default-click',
  },
  {
    title: t('dashboard.metrics.activeLinks'),
    value: props.metrics?.totalLinkExpired,
    percentage: 10,
    icon: 'material-symbols:link-off',
  },
])
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
    <div
      v-for="item in metricData"
      :key="item.title"
      class="rounded-2xl border border-gray-800 bg-white/[0.03] p-5 md:p-6"
    >
      <div class="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
        <Icon :icon="item.icon" class="w-6 h-6" />
      </div>

      <div class="flex items-end justify-between mt-5">
        <div>
          <span class="text-sm text-gray-400">{{ item.title }}</span>
          <h4 class="mt-2 font-bold text-white/90 text-title-sm">
            {{ item.value }}
          </h4>
        </div>

        <!-- <span
          class="flex items-center gap-1 rounded-full bg-success-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
        >
          <svg
            class="fill-current"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247L6.87329 10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125L5.37329 3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
              fill=""
            />
          </svg>

          {{ item.percentage }}%
        </span> -->
      </div>
    </div>
  </div>
</template>
