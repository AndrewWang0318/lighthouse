// webpack模式下
// process.env.NODE_ENV 用于区分运行环境是 线上[打包后的环境] 开发[未打包的环境]
// process.env.VUE_APP_FLAG 用于通过build命令生成后文件环境配置
// vite模式下
// import.meta.env.MODE
let baseURL;
import VConsole from 'vconsole'; // 引入VConsole
if (import.meta.env.MODE == "development") {
  baseURL = "http://127.0.0.1:3000" // 开发环境
  new VConsole(); // 开启移动端调试工具
}else {
  baseURL = "http://101.35.193.41:3000"; // 线上环境
}

export default baseURL