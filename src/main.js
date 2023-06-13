import './assets/main.css' // 导入公用样式

import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'

import Pixelfit from 'pixelfit' // 适配组件
import Vant from "vant"; //引入Vant ui
import 'vant/lib/index.css';
import Loading from "@/components/Loading.vue"; // 引入loading组件
import moment from "moment"; // 引入moment时间处理模块
moment.locale("zh-cn"); // moment采用中文本地化
import anime from "animejs"; // 引入动画js库
import tool from "@/utils/tool"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; // pinia 持久化存储
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
const pixelfit = new Pixelfit({window,width:750});
pixelfit.pixelfit(); // 移动端适配
app.config.globalProperties.pixelfit = pixelfit;
app.config.globalProperties.$moment = moment; // 将moment挂载到vue上
app.config.globalProperties.$anime = anime; // 将anime挂载到vue上
app.config.globalProperties.$tool = tool; // 将tool挂载到vue上
app.use(pinia)
app.use(router)
app.use(Vant)
app.component("Loading", Loading) // 注册全局组件
app.mount('#app')
