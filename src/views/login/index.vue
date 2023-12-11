<template>
  <div class="page-login">
    <div class="banner-content">
      <van-swipe class="login-swipe" :autoplay="4000" indicator-color="white" :show-indicators="false">
        <van-swipe-item v-for="(v, i) in swiperList" :key="i">
          <div class="image-item" :style="`background-image:url(${v.imgSrc})`"></div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 登录表单 -->
    <van-form @submit="onLoginSubmit" v-show="status == 'login'">
      <div class="login-content">
        <van-cell-group inset>
          <van-field v-model="loginForm.user_name" name="user_name" label="用户名" placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]" />
          <van-field v-model="loginForm.user_password" type="password" name="user_password" label="密码" placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]" />
          <van-field name="switch" label="自动登录">
            <template #input>
              <van-switch v-model="autoLogin" active-color="rgb(22, 162, 22)" size="20" />
            </template>
          </van-field>
        </van-cell-group>
      </div>

      <div style="margin: 16px; display: flex">
        <van-button style="margin-right: 0.2rem" type="primary" block native-type="submit">登陆</van-button>
        <van-button type="primary" block plain @click="status = 'registe'">注册</van-button>
      </div>
      <div style="margin: 16px; display: flex">
        <van-button type="primary" block plain @click="downLoadApp">下载APP</van-button>
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
        <van-button block type="primary" @click="status = 'login'"> 返回 </van-button>
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
import { ref, reactive, onBeforeMount, beforeRouteEnter } from 'vue'
import { useRouter } from 'vue-router';
import API from "@/request/api"
import baseUrl from '@/request/base_url'
import $tool from "@/utils/tool"
const router = useRouter();
const store = useStore();
let status = ref("login");
let autoLogin = ref(false) // 免登录开关
let loginForm = reactive({
  user_name: "",
  user_password: "",
})
let registeForm = reactive({
  user_name: "",
  user_password: "",
})
const swiperList = reactive([
  { imgSrc: `${baseUrl}/image/banner/swiper1.jpg` },
  { imgSrc: `${baseUrl}/image/banner/swiper2.png` },
  { imgSrc: `${baseUrl}/image/banner/swiper3.jpg` },
  { imgSrc: `${baseUrl}/image/banner/swiper4.png` },
  { imgSrc: `${baseUrl}/image/banner/swiper5.jpg` },
])
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
beforeEnter((to, from) => {
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
const downLoadApp = () => {
  location.href = "http://101.35.193.41/Glight.apk"
}
</script>

<style scoped lang="scss">
@import "@/assets/sass/Login.scss";
</style>