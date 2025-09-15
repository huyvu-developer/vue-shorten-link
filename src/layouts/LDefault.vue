<script setup lang="ts">
import VHeader from '@/components/Header/VHeader.vue'
import VFooter from '@/components/common/VFooter.vue'
</script>

<template>
  <div>
    <VHeader />
    <slot />
    <VFooter />
  </div>
</template>

<style lang="scss" scoped></style>
