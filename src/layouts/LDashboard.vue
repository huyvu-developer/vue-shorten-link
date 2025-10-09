<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'
import VHeaderDashboard from '@/components/Header/VHeaderDashboard.vue'
import VSidebar from '@/components/Sidebar/VSidebar.vue'
import VBreadcrumb from '@/components/common/VBreadcrumb.vue'
import { defineProps } from 'vue'
interface BreadcrumbProps {
  pageTitle: string
}
defineProps<BreadcrumbProps>()

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
        <v-breadcrumb :pageTitle="pageTitle" />
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
