import axios from "axios"; // 引入axios
// import qs from 'qs' // 引入qs解析库
import { showToast } from "vant"; // 引入vant中的提示信息
import router from "@/router"; // Vue Router
import codeMessage from "./error_code.json" // 状态码错误信息
import baseURL from './base_url'
import { useStore }  from '@/stores/stores'
import $tool from "@/utils/tool"
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
    // const token = localStorage.getItem("token");
    const token = $tool.operatCookie('get','token');

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
    // if (token) localStorage.setItem("token", token); // 存入token
    if (token) $tool.operatCookie("set","token", token,1000 * 60 * 60 * 24); // 存入token
    return response;
  },(err) => {
    loadingSwitch("close");
    showToast(err.message+' '+err.response.data.msg); // 输出错误信息
    // showToast(codeMessage[err.response.status]+';'+err.response.msg); // 输出错误信息
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
const _store = useStore()
function loadingSwitch(state) {
  if (state === "open") _store.loadingSwitch = true;
  if (state === "close") _store.loadingSwitch = false;
}
export default service;