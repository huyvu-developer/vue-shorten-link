<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  title: string
  series?: number[]
  labels?: string[]
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Pie Chart',
  series: () => [35, 25, 20, 12, 8],
  labels: () => ['Desktop', 'Mobile', 'Tablet', 'Other', 'Unknown'],
  colors: () => ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
})

// Use props for series data
const series = computed(() => props.series)

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: 'auto',
  },
  labels: props.labels,
  colors: props.colors,
  legend: {
    position: 'bottom',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    markers: {
      width: 8,
      height: 8,
      radius: 2,
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: props.title,
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            color: '#374151',
            formatter: function (w: { globals: { seriesTotals: number[] } }) {
              return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
            },
          },
          value: {
            show: true,
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            color: '#6B7280',
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
    },
    formatter: function (val: string) {
      return parseFloat(val).toFixed(2) + '%'
    },
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val + ' clicks'
      },
    },
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: {
          height: 300,
        },
        legend: {
          position: 'bottom',
          fontSize: '12px',
        },
      },
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 250,
        },
        legend: {
          position: 'bottom',
          fontSize: '11px',
        },
        dataLabels: {
          enabled: false,
        },
      },
    },
  ],
}))
</script>

<template>
  <div class="w-full rounded-2xl border border-gray-800 bg-white/[0.03] p-5 md:p-6">
    <div class="w-full overflow-x-auto custom-scrollbar">
      <div class="min-w-[250px] sm:min-w-[300px] lg:min-w-full">
        <ApexChart type="donut" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.area-chart {
  width: 100%;
}
</style>
