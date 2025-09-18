<script setup lang="ts">
import { RouterView } from 'vue-router'
import PSidebarProvider from '@/components/Sidebar/Partials/PSidebarProvider.vue'
</script>

<template>
  <PSidebarProvider>
    <div class="min-h-screen bg-background transition-colors duration-200">
      <main>
        <RouterView />
      </main>
    </div>
  </PSidebarProvider>
</template>
