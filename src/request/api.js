import service from "./axios";
class Axios {
  // 封装Axios
  axios(method, url, parmas) {
    return new Promise((resolve, reject) => {
      service
        .request({
          method,
          url,
          data: parmas,
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

class Api extends Axios {// Api继承Axios
  async register(parmas = {}) { // 注册
    return await this.axios("POST", "/user/register", parmas);
  }
  async login(parmas = {}) { // 登录
    return await this.axios("POST", "/user/login", parmas);
  }
  async updateUserInfo(parmas = {}) { // 修改基本信息接口
    return await this.axios("POST", "/user/updateUserInfo", parmas);
  }
  async updateUserAvatar(parmas = {}) { // 修改头像接口
    return await this.axios("POST", "/user/updateUserAvatar", parmas);
  }
  async updateUserEmail(parmas = {}) { // 修改密码
    return await this.axios("POST", "/user/updateUserEmail", parmas);
  }
  async sendEmailCode(parmas = {}) { // 发送邮箱验证码
    return await this.axios("POST", "/user/sendEmailCode", parmas);
  }
  async verifyEmailCode(parmas = {}) { // 检查邮箱验证码
    return await this.axios("POST", "/user/verifyEmailCode", parmas);
  }





  async dynamicList(parmas = {}){ // 获取动态列表
    return await this.axios("POST", "/dynamic/getDynamicList", parmas);
  }
}

const API = new Api()
export default API