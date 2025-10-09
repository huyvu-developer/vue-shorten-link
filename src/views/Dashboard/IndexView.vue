<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LDashboard from '@/layouts/LDashboard.vue'
import LineChart from '@/components/Chart/LineChart.vue'
import PieChart from '@/components/Chart/PieChart.vue'
import ShortLinkMetrics from '@/components/modules/Dashboard/ShortLinkMetrics.vue'
import VDatePicker from '@/components/common/VDatePicker.vue'
import dashboardService from '@/services/dashboard'
import type { AgentAnalytics, Statistics, ShortLinkAnalytics } from '@/types/dashboard'
import { transformAnalyticsData, transformAgentToPieChart } from '@/utils/chart-data-transformers'

const { t } = useI18n()

const metrics = ref<Statistics | null>(null)
const shortLinkAnalytics = ref<ShortLinkAnalytics[]>([])
const clickAnalytics = ref<ShortLinkAnalytics[]>([])
const deviceAnalytics = ref<AgentAnalytics[]>([])
const osAnalytics = ref<AgentAnalytics[]>([])
const browserAnalytics = ref<AgentAnalytics[]>([])

const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(today.getDate() - 30)

const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)

const defaultStartDate = thirtyDaysAgo.toISOString().split('T')[0]
const defaultEndDate = tomorrow.toISOString().split('T')[0]
const defaultDateRange = `${defaultStartDate} to ${defaultEndDate}`

const dateRange = ref<string | null>(defaultDateRange)

const apiCalls = {
  async fetchStatistics(startDate: string, endDate: string) {
    const response = await dashboardService.getStatistics(startDate, endDate)
    metrics.value = response.data
  },

  async fetchShortLinkAnalytics(startDate: string, endDate: string) {
    const response = await dashboardService.getAnalyticsChart('short-link', startDate, endDate)
    shortLinkAnalytics.value = response.data
  },

  async fetchClickAnalytics(startDate: string, endDate: string) {
    const response = await dashboardService.getAnalyticsChart('click-count', startDate, endDate)
    clickAnalytics.value = response.data
  },

  async fetchDeviceAnalytics(startDate: string, endDate: string) {
    const response = await dashboardService.getAgentAnalytics('device', startDate, endDate)
    deviceAnalytics.value = response.data
  },

  async fetchOsAnalytics(startDate: string, endDate: string) {
    const response = await dashboardService.getAgentAnalytics('os', startDate, endDate)
    osAnalytics.value = response.data
  },

  async fetchBrowserAnalytics(startDate: string, endDate: string) {
    const response = await dashboardService.getAgentAnalytics('browser', startDate, endDate)
    browserAnalytics.value = response.data
  },
}

const fetchAllData = async (fromDate?: string, toDate?: string) => {
  try {
    const startDate = fromDate || defaultStartDate
    const endDate = toDate || defaultEndDate
    await Promise.all([
      apiCalls.fetchStatistics(startDate, endDate),
      apiCalls.fetchShortLinkAnalytics(startDate, endDate),
      apiCalls.fetchClickAnalytics(startDate, endDate),
      apiCalls.fetchDeviceAnalytics(startDate, endDate),
      apiCalls.fetchOsAnalytics(startDate, endDate),
      apiCalls.fetchBrowserAnalytics(startDate, endDate),
    ])
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

const chartData = {
  shortLink: computed(() =>
    transformAnalyticsData(shortLinkAnalytics.value, 'Short Links Created', {
      month: 'short',
      day: 'numeric',
    }),
  ),

  click: computed(() =>
    transformAnalyticsData(clickAnalytics.value, 'Click Analytics', {
      month: 'short',
      day: 'numeric',
    }),
  ),

  device: computed(() => {
    const result = transformAgentToPieChart(deviceAnalytics.value, [
      '#3B82F6', // Blue - Desktop
      '#10B981', // Green - Mobile
      '#F59E0B', // Amber - Tablet
      '#EF4444', // Red - Other
      '#8B5CF6', // Purple - Unknown
    ])
    console.log('Device Analytics Raw:', deviceAnalytics.value)
    console.log('Device Chart Data:', result)
    return result
  }),

  os: computed(() => {
    const result = transformAgentToPieChart(osAnalytics.value, [
      '#0078D4', // Windows Blue
      '#8B5CF6', // macOS Purple
      '#FF9500', // Linux Orange
      '#34C759', // Mobile Green
      '#EF4444', // Other Red
    ])
    console.log('OS Analytics Raw:', osAnalytics.value)
    console.log('OS Chart Data:', result)
    return result
  }),

  browser: computed(() => {
    const result = transformAgentToPieChart(browserAnalytics.value, [
      '#4285F4', // Chrome Blue
      '#FF6B6B', // Safari Red
      '#4ECDC4', // Firefox Teal
      '#10B981', // Edge Green
      '#F59E0B', // Other Amber
    ])
    console.log('Browser Analytics Raw:', browserAnalytics.value)
    console.log('Browser Chart Data:', result)
    return result
  }),
}

watch(
  dateRange,
  (newRange) => {
    if (newRange) {
      const dateRangeArray = newRange.split(' to ')
      if (dateRangeArray && dateRangeArray.length === 2) {
        const [startDate, endDate] = dateRangeArray
        fetchAllData(startDate, endDate)
      }
    }
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <LDashboard :pageTitle="t('sidebar.dashboard')">
    <div class="flex flex-col gap-4 sm:gap-6">
      <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
        <VDatePicker
          v-model="dateRange"
          :title="t('dashboard.dateRange.title')"
          type="date"
          dateFormat="Y-m-d"
          mode="range"
          :placeholder="t('dashboard.dateRange.placeholder')"
        />
      </div>

      <div class="w-full">
        <ShortLinkMetrics :metrics="metrics" />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div class="w-full">
          <LineChart
            :title="t('dashboard.charts.shortLinkAnalytics')"
            :series="chartData.shortLink.value.series"
            :categories="chartData.shortLink.value.categories"
          />
        </div>
        <div class="w-full">
          <LineChart
            :title="t('dashboard.charts.clickAnalytics')"
            :series="chartData.click.value.series"
            :categories="chartData.click.value.categories"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div class="w-full">
          <PieChart
            :title="t('dashboard.charts.browser')"
            :series="chartData.browser.value.series"
            :labels="chartData.browser.value.labels"
            :colors="chartData.browser.value.colors"
          />
        </div>
        <div class="w-full">
          <PieChart
            :title="t('dashboard.charts.device')"
            :series="chartData.device.value.series"
            :labels="chartData.device.value.labels"
            :colors="chartData.device.value.colors"
          />
        </div>
        <div class="w-full sm:col-span-2 lg:col-span-1">
          <PieChart
            :title="t('dashboard.charts.os')"
            :series="chartData.os.value.series"
            :labels="chartData.os.value.labels"
            :colors="chartData.os.value.colors"
          />
        </div>
      </div>
    </div>
  </LDashboard>
</template>

<style lang="scss" scoped></style>
