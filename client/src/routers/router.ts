import * as vRouter from 'vue-router'
import { useSessionStore } from '../stores/userSession'

function loadPage(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/pages/${view}.vue`)
}

const _routes: Array<vRouter.RouteRecordRaw> = [
  {
    path: '/',
    name: 'dashboard',
    component: loadPage('DashboardScreen'),
    meta: {
      needsAuth: true
    }
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: loadPage('WelcomeScreen')
  }
]

const router = vRouter.createRouter({
  history: vRouter.createWebHistory(import.meta.env.BASE_URL),
  routes: _routes
})

router.beforeEach((to, from, next) => {
  const userSession = useSessionStore()

  if (to.meta.needsAuth) {
    if (userSession.session) {
      return next()
    } else {
      return next('/welcome')
    }
  }
  return next()
})

export default router
