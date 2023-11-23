import './assets/styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './routers/router'
import { firebaseApp } from '@/utils/firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useSessionStore } from '@/stores/userSession'

const _pinia = createPinia()

_pinia.use(piniaPluginPersistedstate)

let app
onAuthStateChanged(getAuth(firebaseApp), async (user) => {
  if (!app) {
    app = createApp(App)
    app.use(_pinia)

    const sessionStore = useSessionStore()
    if (user === null) {
      sessionStore.setUser({ email: null, uid: null })
    } else {
      sessionStore.setUser(user as User)
    }

    app.use(router)
    app.mount('#app')
  }
})
