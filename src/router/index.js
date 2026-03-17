import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/layouts/CommandCenterLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/DashboardPage.vue')
        },
        {
          path: 'management',
          name: 'Management',
          component: () => import('@/views/ManagementPage.vue')
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/SettingsPage.vue')
        },
        {
          path: 'satellite/dashboard',
          name: 'SatelliteDashboard',
          component: () => import('@/views/satellite/SatelliteDashboardPage.vue')
        },
        {
          path: 'satellite/planning',
          name: 'SatellitePlanning',
          component: () => import('@/views/satellite/SatellitePlanningPage.vue')
        },
        {
          path: 'satellite/mission',
          name: 'SatelliteMission',
          component: () => import('@/views/satellite/SatelliteMissionPage.vue')
        },
        {
          path: 'satellite/ttc',
          name: 'SatelliteTtc',
          component: () => import('@/views/satellite/SatelliteTtcPage.vue')
        },
        {
          path: 'satellite/station',
          name: 'SatelliteStation',
          component: () => import('@/views/satellite/SatelliteStationPage.vue')
        },
        {
          path: 'satellite/satellite',
          name: 'SatelliteSatellite',
          component: () => import('@/views/satellite/SatelliteSatellitePage.vue')
        },
        {
          path: 'satellite/qa',
          name: 'SatelliteQa',
          component: () => import('@/views/satellite/SatelliteQaPage.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router