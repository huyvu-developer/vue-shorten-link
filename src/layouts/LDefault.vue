<script setup lang="ts">
import VHeader from '@/components/Header/VHeader.vue'
import VFooter from '@/components/Footer/VFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <VHeader />
    <slot class="flex-1" />
    <VFooter />
  </div>
</template>

<style lang="scss" scoped></style>
