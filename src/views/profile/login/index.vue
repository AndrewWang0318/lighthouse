<template>
  <div class="page-login">
    <div class="logo-name">LIGHT-HOUSE</div>
    <!-- 登录表单 -->
    <van-form @submit="onLoginSubmit" v-show="status == 'login'">
      <div class="login-content">
        <van-cell-group inset>
          <van-field v-model="loginForm.user_name" name="user_name" label="" placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]" />
          <van-field v-model="loginForm.user_password" type="password" name="user_password" label="" placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]" />
        </van-cell-group>
      </div>

      <div style="margin: 16px">
        <van-button type="primary" block native-type="submit">登录</van-button>
        <van-button type="primary" block plain @click="status = 'registe'">注册</van-button>
        <van-button type="primary" block plain @click="status = 'registe'">游客登录</van-button>
      </div>
    </van-form>
    <!-- 注册表单 -->
    <van-form @submit="onRegisteSubmit" v-show="status == 'registe'">
      <div class="register-content">
        <van-cell-group inset>
          <van-field v-model="registeForm.user_name" name="user_name" label="用户名" placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名!!!' }]" />
          <van-field v-model="registeForm.user_password" type="password" name="user_password" label="密码" placeholder="密码"
            :rules="[{ required: true, message: '请填写密码!!!' }]" />
        </van-cell-group>
      </div>
      <div style="margin: 16px">
        <van-button style="margin-bottom: 0.2rem;" block type="primary" native-type="submit">
          点击注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: 'LoginPage'
}
</script>

<script setup>
import { useStore } from '@/stores/stores'
import { showToast } from "vant"
import { ref, reactive, onBeforeMount } from 'vue'
import { useRouter,onBeforeRouteLeave } from 'vue-router';
import API from "@/server/api"




import $tool from "aw-util"
const router = useRouter();
const store = useStore();
let status = ref("login");
let autoLogin = ref(true) // 免登录开关
let loginForm = reactive({
  user_name: "",
  user_password: "",
})
let registeForm = reactive({
  user_name: "",
  user_password: "",
})

const onLoginSubmit = (form) => {// 用户登录
  let params = form
  API.login(params).then((res) => {
    showToast(res.data.msg);
    if (res.data.code == 0) {
      store.userInfoAction(res.data.user_info) // 存入状态管理
      // 如果自动登录存在
      if (autoLogin.value) {
        $tool.operatCookie("set", "user_info", JSON.stringify(form), 1000 * 60 * 60 * 24); // 存入cookie用于自动登录
      }
      router.push("/Home");
    }
  });
}
const onRegisteSubmit = (form) => {// 注册新用户
  API.register(form).then((res) => {
    showToast(res.data.msg);
    if (res.data.code == 0) {
      status.value = "login";
      registeForm = {
        user_name: "",
        user_password: "",
      };
      loginForm = form;
    }
  })
}
onBeforeMount(() => {
  // 校验cookie后自动登录
  let user_cookie = $tool.operatCookie("get", "user_info");
  if (user_cookie && user_cookie != "{}") {
    let params = JSON.parse(user_cookie)
    onLoginSubmit(params);
  }
})
onBeforeRouteLeave((to, from) => {
  let user_cookie = $tool.operatCookie("get", "user_info");
  let userInfo = store.userInfo;
  if (from.path != "/") {
    if ((user_cookie && user_cookie != "{}") && (userInfo && JSON.stringify(userInfo) != "{}")) {
      showToast("当前已登录~");
      return false
    } else {
      return true
    }
  } else {
    return true
  }
})
</script>

<style scoped lang="scss">
@import "@/assets/sass/Login.scss";
</style>