import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/router'

import Pixelfit from 'pixelfit' // 适配组件
import Vant from "vant"; //引入Vant ui
import 'vant/lib/index.css';
import moment from "moment"; // 引入moment时间处理模块
import 'moment/dist/locale/zh-cn'; // 引入中文环境
import anime from "animejs"; // 引入动画js库
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; // pinia 持久化存储
import { Fragment } from 'vue-fragment-plus'; // 空标签
import Loading from "@/components/loading.vue"; // 引入loading组件
import base_url from '@/server/base_url';
// import tool from "@/utils/tool"
import tool from 'aw-util'
console.log(tool)
import directives from '@/utils/directives'; // 引入自己定义的全局指令
import Vue3TouchEvents from "vue3-touch-events";
import '@/assets/index.css' // 导入公用样式
moment.locale("zh-cn"); // moment采用中文本地化

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
const pixelfit = new Pixelfit({window,width:750});
pixelfit.pixelfit(); // 移动端适配
app.config.globalProperties.pixelfit = pixelfit;
app.config.globalProperties.moment = moment; // 将moment挂载到vue上
app.config.globalProperties.anime = anime; // 将anime挂载到vue上
app.config.globalProperties.tool = tool; // 将tool挂载到vue上
app.config.globalProperties.base_url = base_url; // 将tool挂载到vue上
app.use(pinia)
app.use(router)
app.use(Vant)
app.use(Fragment)
app.use(Vue3TouchEvents)
app.use(directives)
app.component("Loading", Loading) // 注册全局组件
app.mount('#app')
