import './assets/main.css'

import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import VueApexCharts from 'vue3-apexcharts'
import 'flatpickr/dist/flatpickr.css'

// Define the type for plugin modules
type PluginModule = {
  default: {
    install: (app: VueApp) => void
  }
}

const pluginModules = import.meta.glob('./plugins/*.ts', { eager: true }) as Record<
  string,
  PluginModule
>
const plugins = Object.values(pluginModules).map((module) => module.default)

const app = createApp(App)

app.use(createPinia())
const authStore = useAuthStore()
await authStore.authorize()
app.use(router)
app.component('ApexChart', VueApexCharts)

/**
 * Register plugin
 */
plugins.forEach((plugin) => app.use(plugin))

app.mount('#app')
