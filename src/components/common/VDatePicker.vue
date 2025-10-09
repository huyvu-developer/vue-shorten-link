<script setup lang="ts">
import { computed } from 'vue'
import flatPickr from 'vue-flatpickr-component'

interface DatePickerProps {
  title?: string
  type?: 'date' | 'datetime' | 'time'
  locale?: string
  dateFormat?: string
  mode?: 'single' | 'multiple' | 'range'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  minDate?: string | null
  maxDate?: string | null
  minTime?: string | null
  maxTime?: string | null
  time_24hr?: boolean
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  title: 'Date Picker Input',
  type: 'date',
  locale: 'en',
  dateFormat: 'Y-m-d',
  mode: 'single',
  placeholder: 'Select date',
  disabled: false,
  readonly: false,
  minDate: null,
  maxDate: null,
  minTime: null,
  maxTime: null,
  time_24hr: false,
})

const modelValue = defineModel<string | null>('modelValue', {
  required: true,
})

// Create flatpickr config from props
const flatpickrConfig = computed(() => {
  const config: Record<string, unknown> = {
    dateFormat: props.dateFormat,
    mode: props.mode,
    enableTime: props.type === 'datetime' || props.type === 'time',
    noCalendar: props.type === 'time',
    time_24hr: props.time_24hr,
    readonly: props.readonly,
  }

  // Only add date/time properties if they are not null
  if (props.minDate) config.minDate = props.minDate
  if (props.maxDate) config.maxDate = props.maxDate
  if (props.minTime) config.minTime = props.minTime
  if (props.maxTime) config.maxTime = props.maxTime

  return config
})
</script>

<template>
  <div>
    <label class="mb-1.5 block text-sm font-medium text-gray-400">
      {{ props.title }}
    </label>
    <div class="relative">
      <flat-pickr
        v-model="modelValue"
        :config="flatpickrConfig"
        :disabled="props.disabled"
        class="h-11 w-full appearance-none rounded-lg border border-gray-700 bg-gray-900 bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-white/90 shadow-theme-xs placeholder:text-white/30 focus:border-brand-800 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
        :placeholder="props.placeholder"
      />
      <span class="absolute text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
        <svg
          class="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
            fill=""
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
