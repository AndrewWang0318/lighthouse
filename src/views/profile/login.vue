<template>
  <div class="page-login">
    <div class="row-logo">
      <div class="name-text">LIGHTHOUSE</div>
    </div>
    <!-- 登录表单 -->
    <div class="row-form">
      <van-form @submit="onLoginSubmit">
        <div class="form-content">
          <van-field class="item-form-content" v-model="login_form.user_name" input-align="center" name="user_name" placeholder="请输入账户" />
          <van-field class="item-form-content" v-model="login_form.user_password" input-align="center" type="password" name="user_password"
            placeholder="请输入密码" clearable />
        </div>
        <div class="form-function">
          <van-button type="primary" disabled block native-type="submit">登录</van-button>
        </div>


      </van-form>
    </div>
    <div class="row-function">
      <div class="item-function btn-register" @click="routeToRegister">
        <div class="icon around">
          <van-icon name="plus" />
        </div>
        <div class="text">注册</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage'
}
</script>

<script setup>
import { useStore } from '@/stores/stores';
import { showToast } from "vant";
import { ref, reactive, onBeforeMount } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import API from "@/server/api";
import $tool from "aw-util";

const router = useRouter();
const store = useStore();
const autoLogin = ref(true) // 免登录开关
const login_form = reactive({
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
const routeToRegister = () => {

  router.push({ path: "/register" })
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
@import "@/assets/sass/login.scss";
</style>