import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/me',
      name: 'me',
      meta: {
        requiresAuth: true,
      },
      component: () => import('../views/ProfileView.vue'),
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth && !useAuthStore().isAuthenticated) {
    return next('/')
  }
  next()
})

export default router
