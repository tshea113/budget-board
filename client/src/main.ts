import './assets/styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './routers/router'

const _pinia = createPinia()

_pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(_pinia)
app.use(router)
app.mount('#app')
