import service from "./axios";
class Axios {
  // 封装Axios
  axios(method, url, params) {
    return new Promise((resolve, reject) => {
      let option = {};
      if (method == "GET") {
        option = { method, url, params };
      } else {
        option = { method, url, data: params };
      }
      service
        .request(option)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

class Api extends Axios {
  // Api继承Axios
  async register(parmas = {}) {
    // 注册
    return await this.axios("POST", "/user/register", parmas);
  }
  async login(parmas = {}) {
    // 登录
    return await this.axios("POST", "/user/login", parmas);
  }
  async updateUserInfo(parmas = {}) {
    // 修改基本信息接口
    return await this.axios("POST", "/user/updateUserInfo", parmas);
  }
  async updateUserAvatar(parmas = {}) {
    // 修改头像接口
    return await this.axios("POST", "/user/updateUserAvatar", parmas);
  }
  async updateUserEmail(parmas = {}) {
    // 修改密码
    return await this.axios("POST", "/user/updateUserEmail", parmas);
  }
  async sendEmailCode(parmas = {}) {
    // 发送邮箱验证码
    return await this.axios("POST", "/user/sendEmailCode", parmas);
  }
  async verifyEmailCode(parmas = {}) {
    // 检查邮箱验证码
    return await this.axios("POST", "/user/verifyEmailCode", parmas);
  }

  async addDynamic(parmas = {}) {
    // 新增动态
    return await this.axios("POST", "/dynamic/addDynamic", parmas);
  }
  async getDynamicList(parmas = {}) {
    // 获取动态列表
    return await this.axios("GET", "/dynamic/getDynamicList", parmas);
  }

  async addLike(parmas = {}) {
    // 点赞
    return await this.axios("POST", "/like/addLike", parmas);
  }
  async cancelLike(parmas = {}) {
    // 取消赞
    return await this.axios("POST", "/like/cancelLike", parmas);
  }

  async addComment(parmas = {}) {
    // 新增评论
    return await this.axios("POST", "/comment/addComment", parmas);
  }
}

const API = new Api();
export default API;
