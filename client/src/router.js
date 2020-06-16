import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
import Home from './views/Home.vue';
import Dashboard from './views/Dashboard.vue';
import Workout from './views/Workout.vue';
import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: { requiresAuth: true },
      component: Dashboard,
    },
    {
      path: '/workout',
      name: 'workout',
      meta: { requiresAuth: true },
      component: Workout,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

router.beforeEach((to, from, next) => {
  store.dispatch('fetchAccessToken');
  axios.get('http://127.0.0.1:5000/getUser', {
    headers: {
      Authorization: `Bearer ${store.state.accessToken}`,
    },
  })
    .then((res) => {
      store.dispatch('setAccount', res.data);

      if (to.matched.some(record => record.meta.requiresAuth)) {
        // For routes that required authorization
        if (store.state.account.email) {
          next();
        } else {
          // Redirect home for unauthorized users
          next('/');
        }
      } else {
        // For routes that do not required authorizaiton
        // If user is logged in redirect home page to dashboard
        if (store.state.account.email && (to.path === '/')) {
          next('/dashboard');
        }
        // Proceed otherwise
        next();
      }
    })
    .catch((err) => {
      store.dispatch('setAccount', {
        firstName: null,
        lastName: null,
        email: null,
      });
      next('/');
    });
});

export default router;
