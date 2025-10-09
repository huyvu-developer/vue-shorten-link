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
      path: '/dashboard',
      name: 'dashboard',
      meta: {
        requiresAuth: true,
      },
      component: () => import('../views/Dashboard/IndexView.vue'),
    },
    {
      path: '/dashboard/short-links',
      name: 'dashboard-short-links',
      meta: {
        requiresAuth: true,
      },
      component: () => import('../views/Dashboard/ShortLinkView.vue'),
    },
    {
      path: '/signin',
      name: 'signin',
      meta: {
        redirectIfAuthenticated: true,
      },
      component: () => import('../views/Auth/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      meta: {
        redirectIfAuthenticated: true,
      },
      component: () => import('../views/Auth/RegisterView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Redirect authenticated users away from auth pages
  if (to.meta.redirectIfAuthenticated && auth.isAuthenticated) {
    return next('/dashboard')
  }

  // Redirect unauthenticated users to login for protected routes
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/signin')
  }

  next()
})

export default router
