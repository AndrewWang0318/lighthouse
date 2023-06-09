import axios from "axios"; // 引入axios
// import qs from 'qs' // 引入qs解析库
import { Toast } from "vant"; // 引入vant中的提示信息
import router from "@/router"; // Vue Router
import codeMessage from "./error_code.json" // 状态码错误信息
import baseURL from './base_url'
// 创建axios实例
const service = axios.create({
  baseURL,
  timeout: 60 * 1000 * 60,// 超时时间1小时
  // headers:{ // 设置请求头
  //   get:{
  //     'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
  //   },
  //   post:{
  //     // 'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
  //     // 'Content-Type':'application/json;charset=utf-8'
  //     // 'Content-Type':'multipart/form-data'
  //   }
  // }
});
// 请求拦截
service.interceptors.request.use(
  (config) => {
    loadingSwitch("open");
    const token = localStorage.getItem("token");
    if (token) config.headers["authorization"] = "Bearer " + token; // 请求头带token
    // if(config.method === 'post'){ // 更加请求头的headers来决定,如果是application/json;charset=utf-8,则不需要qs转化
    //   config.data = qs.stringify(config.data)// 如果是post请求,将参数转化为JSONSTRING
    // }
    return config;
  },(err) => {
    return Promise.reject(err);
  }
);

// 响应拦截
service.interceptors.response.use(
  (response) => {
    loadingSwitch("close");
    const token = response.data.token;
    if (token) localStorage.setItem("token", token); // 存入token
    return response;
  },(err) => {
    loadingSwitch("close");
    Toast(codeMessage[err.response.status]); // 输出错误信息
    switch (err.response.status) {
      case 401: // token过期或错误
        router.replace("/login");
        break;
      default:
        break;
    }
    return Promise.reject(err); // 返回错误通过catch捕获该错误
  }
);
// loading开关函数
// function loadingSwitch(state) {
//   if (state === "open") store.dispatch("GlobaLoadingShowActions", true);
//   if (state === "close") store.dispatch("GlobaLoadingShowActions", false);
// }
export default service;