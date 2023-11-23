import * as vRouter from 'vue-router'
import { useSessionStore } from '../stores/userSession'

function loadPage(view: string) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/pages/${view}.vue`)
}

const _routes: Array<vRouter.RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: loadPage('WelcomeScreen'),
    meta: {
      hideForAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: loadPage('DashboardScreen'),
    meta: {
      needsAuth: true
    }
  }
]

const router = vRouter.createRouter({
  history: vRouter.createWebHistory(import.meta.env.BASE_URL),
  routes: _routes
})

router.beforeEach((to, from, next) => {
  const userSession = useSessionStore()

  if (to.meta.needsAuth) {
    if (userSession.userData === null) {
      console.log('Route requires auth!')
      return next({ name: 'home' })
    } else {
      return next()
    }
  } else if (to.meta.hideForAuth) {
    if (userSession.userData === null) {
      return next()
    } else {
      console.log('Route hidden from auth!')
      return next({ name: 'dashboard' })
    }
  } else {
    return next()
  }
})

export default router
