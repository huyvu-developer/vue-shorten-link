<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'

import { useSidebarProvider } from '@/composables/useSidebar'

onBeforeMount(() => {
  useSidebarProvider()
})
</script>
