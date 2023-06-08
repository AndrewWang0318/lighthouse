import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Pixelfit from 'pixelfit'

const app = createApp(App)
const pixelfit = new Pixelfit({window,width:750});
pixelfit.pixelfit();
app.config.globalProperties.pixelfit = pixelfit;

app.mount('#app')
