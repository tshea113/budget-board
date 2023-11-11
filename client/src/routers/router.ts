import * as vRouter from 'vue-router'
import { useSessionStore } from '../stores/userSession'

function loadPage(view: string) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/pages/${view}.vue`)
}

const _routes: Array<vRouter.RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
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
    if (userSession.session) {
      return next()
    } else {
      console.log('Route requires auth!')
      return next('/')
    }
  } else if (to.meta.hideForAuth) {
    if (userSession.session) {
      console.log('Route hidden from auth!')
      return next('/dashboard')
    }
    return next()
  }
  return next()
})

export default router
