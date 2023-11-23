import * as vRouter from 'vue-router'
import { useSessionStore } from '../stores/userSession'

function loadPage(view: string) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/pages/${view}.vue`)
}

// Checks if the user isn't authenticated before proceeding
const ifNotAuthenticated = (to, from, next) => {
  const userSession = useSessionStore()
  if (!userSession.isUserLoggedIn()) {
    next()
    return
  }
  console.log('User is authenticated, redirecting to dashboard')
  next('/dashboard')
}

// Checks if the user is authenticated before proceeding
const ifAuthenticated = (to, from, next) => {
  const userSession = useSessionStore()
  if (userSession.isUserLoggedIn()) {
    next()
    return
  }
  console.log('User is not authenticated, redirecting to home')
  next('/')
}

const _routes: Array<vRouter.RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: loadPage('WelcomeScreen'),
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: loadPage('DashboardScreen'),
    beforeEnter: ifAuthenticated
  }
]

const router = vRouter.createRouter({
  history: vRouter.createWebHistory(import.meta.env.BASE_URL),
  routes: _routes
})

export default router
