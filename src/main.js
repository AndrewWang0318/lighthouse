import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Pixelfit from 'pixelfit'

const app = createApp(App)
const pixelfit = new Pixelfit({window,width:750});
pixelfit.pixelfit();
app.config.globalProperties.pixelfit = pixelfit;

app.use(createPinia())
app.use(router)

app.mount('#app')
