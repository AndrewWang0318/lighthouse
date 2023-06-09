let baseURL;
import VConsole from 'vconsole'; // 引入VConsole
if (process.env.NODE_ENV == "development") {
  baseURL = "/api" // 开发环境
  new VConsole(); // 开启移动端调试工具
}else {
  baseURL = "http://101.35.193.41:3000"; // 线上环境
}

export default baseURL