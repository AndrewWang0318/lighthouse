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
            placeholder="请输入密码" 
            />
        </div>
        <div class="form-function">
          <van-button type="primary" :disabled="is_unlogin" block native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>
    <div class="row-function">
      <div class="item-function btn-register" @click="customerLogin">
        <div class="icon around">
          <van-icon name="friends" />
        </div>
        <div class="text">自动注册</div>
      </div>
      <div class="item-function btn-register" @click="routeToRegister">
        <div class="icon around">
          <van-icon name="plus" />
        </div>
        <div class="text">手动注册</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loginPage'
}
</script>

<script setup>

import { ref, reactive, onBeforeMount,watch } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { showToast } from "vant";
import { useStore } from '@/stores/stores';
import API from "@/server/api";
import $tool from "aw-util";

const router = useRouter();
const store = useStore();
const auto_login = ref(true) // 免登录开关
const is_unlogin = ref(true) // 免登录开关
const login_form = reactive({
  user_name: "",
  user_password: "",
})

watch(login_form,(nval,oval)=>{
  if(nval.user_name.trim() != "" && nval.user_password.trim() != ""){
    is_unlogin.value = false
  }else{
    is_unlogin.value = true
  }
})

onBeforeMount(() => {
  // 校验cookie后自动登录
  let user_cookie = $tool.operatCookie("get", "user_info");
  if (user_cookie && user_cookie != "{}") {
    let params = JSON.parse(user_cookie)
    onLoginSubmit(params);
  }
})

const onLoginSubmit = (form) => {// 用户登录
  let params = form
  API.login(params).then((res) => {
    showToast(res.data.msg);
    if (res.data.code == 0) {
      store.userInfoAction(res.data.user_info) // 存入状态管理
      // 如果自动登录存在
      if (auto_login.value) {
        $tool.operatCookie("set", "user_info", JSON.stringify(form), 1000 * 60 * 60 * 24); // 存入cookie用于自动登录
      }
      router.push("/home/index");
    }
  });
}
const routeToRegister = () => {
  router.push({ path: "/register" })
}
const customerLogin = () => {

}

// 游客登录 自动帮助用户注册账号
</script>

<style scoped lang="scss">
@import "@/assets/sass/login.scss";
</style>