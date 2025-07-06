import './assets/main.css'
import './assets/by-bootstrap.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import axiosPlugin from './plugins/axios';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(axiosPlugin)

app.mount('#app')