<template>
   <div class="login">
    <van-nav-bar
      title="登录"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <van-swipe
      class="login-swipe"
      :autoplay="3000"
      indicator-color="white"
      :show-indicators="false"
      :touchable="false"
    >
      <van-swipe-item v-for="(v, i) in swiperList" :key="i">
        <div
          class="image-item"
          :style="`background-image:url(${v.imgSrc})`"
        ></div>
      </van-swipe-item>
    </van-swipe>
    <!-- 登录表单 -->
    <van-form @submit="onLoginSubmit" v-show="status === 'login'">
      <div class="login-content">
        <van-cell-group inset>
          <van-field
            v-model="loginForm.user_name"
            name="user_name"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="loginForm.user_password"
            type="password"
            name="user_password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field name="switch" label="自动登录">
            <template #input>
              <van-switch
                v-model="autoLogin"
                active-color="rgb(22, 162, 22)"
                size="20"
              />
            </template>
          </van-field>
        </van-cell-group>
      </div>

      <div style="margin: 16px; display: flex">
        <van-button
          style="margin-right: 0.2rem"
          type="primary"
          block
          native-type="submit"
          >登陆</van-button
        >
        <van-button type="primary" block plain @click="status = 'registe'"
          >注册</van-button
        >
      </div>
    </van-form>
    <!-- 注册表单 -->
    <van-form @submit="onRegisteSubmit" v-show="status === 'registe'">
      <div class="register-content">
        <van-cell-group inset>
          <van-field
            v-model="registeForm.user_name"
            name="user_name"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名!!!' }]"
          />
          <van-field
            v-model="registeForm.user_password"
            type="password"
            name="user_password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码!!!' }]"
          />
        </van-cell-group>
      </div>
      <div style="margin: 16px">
        <van-button block type="primary" native-type="submit">
          点击注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup >
  import { store } from '@/stores/stores'
  import { showToast } from "vant"
  import { ref,reactive,onMounted } from 'vue'
  import _API from "@/request/api"
  import baseUrl from '@/request/base_url'
  import $tool from "@/assets/js/util"
  import router from '@/router'
  const _store = store();

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
  const swiperList = reactive( [
    { imgSrc: `${baseUrl}/image/swiper1.jpg` },
    { imgSrc: `${baseUrl}/image/swiper2.jpg` },
    { imgSrc: `${baseUrl}/image/swiper3.jpg` },
    { imgSrc: `${baseUrl}/image/swiper4.jpg` },
    { imgSrc: `${baseUrl}/image/swiper5.jpg` },
  ])

  const onClickLeft = () => {// 返回
    router.go("-1");
  }

  const onLoginSubmit = (form) => {// 用户登录
    let params= form
    _API.login(params).then((res) => {
      showToast(res.data.msg);
      _store.userInfoAction(res.data.user_info) // 存入状态管理
      if (autoLogin) $tool.operatCookie("set","user_info",JSON.stringify(form),9999); // 存入cookie,自动登录

      router.push("/home/mine");
    });
  }
  const onRegisteSubmit = (form) => {// 注册新用户
    _API.register(form).then((res) => {
      showToast(res.data.msg);
      if(res.status === 200 && res.data.code === 0){
        registeForm = {
          user_name: "",
          user_password: "",
        };
        loginForm = form;
        status = "login";
      }
    }).catch(err => {
      showToast(err.response.data.msg);
    });
  }

  onMounted(()=>{
    // 校验cookie后自动登录
    let user_cookie = $tool.operatCookie("get", "user_info");
    if (user_cookie && user_cookie != "{}") {
      onLoginSubmit(user_cookie);
    }
  })

</script>

<style scoped lang="scss">
@import "@/assets/sass/Login.scss";
</style>