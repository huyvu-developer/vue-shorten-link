import './assets/main.css'

import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

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

/**
 * Register plugin
 */
plugins.forEach((plugin) => app.use(plugin))

app.mount('#app')
