import './assets/styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './routers/router'

const _pinia = createPinia()

const app = createApp(App)
app.use(_pinia)
app.use(router)
app.mount('#app')
