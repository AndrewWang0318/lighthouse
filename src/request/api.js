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
}

const API = new Api()
export default API