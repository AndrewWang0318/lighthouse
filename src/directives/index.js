import clickout from './clickout' // 引入指令

const directives = { // 指令对象
  clickout
}

export default {
    install(app) {
      Object.keys(directives).forEach((key) => {
        app.directive(key, directives[key])// 参数：全局注册名,内容
      });
    }
}