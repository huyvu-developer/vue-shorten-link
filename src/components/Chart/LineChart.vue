<script setup lang="ts">
import { computed } from 'vue'

interface Series {
  name: string
  data: number[]
}
interface Props {
  title: string
  series?: Series[]
  categories?: string[]
  dataLabels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Sales',
  series: () => [
    {
      name: 'Sales',
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: 'Revenue',
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ],
  categories: () => [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dataLabels: true,
})

const chartOptions = computed(() => ({
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3B82F6', '#10B981'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  fill: {
    gradient: {
      enabled: true,
      opacityFrom: 0.55,
      opacityTo: 0,
    },
  },
  stroke: {
    curve: 'straight',
    width: [2, 2],
  },
  markers: {
    size: 0,
  },
  labels: {
    show: false,
    position: 'top',
  },
  grid: {
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: props.dataLabels,
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy',
    },
  },
  xaxis: {
    type: 'category',
    categories: props.categories,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
  },
}))

// Responsive chart height
const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 640 ? 250 : 310
  }
  return 310
})
</script>

<template>
  <div class="w-full rounded-2xl border border-gray-800 bg-white/[0.03] p-5 md:p-6">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-white/90">{{ title }}</h3>
    </div>
    <div class="w-full overflow-x-auto custom-scrollbar">
      <div class="min-w-[300px] sm:min-w-[400px] lg:min-w-full">
        <ApexChart
          type="area"
          :height="chartHeight"
          :options="chartOptions"
          :series="props.series"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.area-chart {
  width: 100%;
}
</style>
