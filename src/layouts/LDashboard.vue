<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'
import VHeaderDashboard from '@/components/Header/VHeaderDashboard.vue'
import VSidebar from '@/components/Sidebar/VSidebar.vue'

const { isExpanded, isHovered } = useSidebar()
</script>

<template>
  <div class="min-h-screen xl:flex">
    <VSidebar />
    <div
      class="flex-1 transition-all duration-300 ease-in-out min-w-0"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <VHeaderDashboard />
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
