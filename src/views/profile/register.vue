<template>
  <div class="page-register">
    
    <div class="row-logo">
      <div class="name-text">LIGHTHOUSE</div>
    </div>
    <!-- 登录表单 -->
    <div class="row-form">
      <van-form @submit="onRegisteSubmit">
        <div class="form-content">
          <van-field class="item-form-content" v-model="registe_form.user_name" input-align="center" name="user_name" 
            placeholder="用户名" />
          <van-field class="item-form-content" v-model="registe_form.user_password" input-align="center" clearable type="password"
            name="user_password" placeholder="密码" />
            <van-field class="item-form-content" v-model="registe_form.user_password" input-align="center" clearable type="password"
            name="user_password" placeholder="确认密码" />
        </div>
        <div class="form-function">
          <van-button type="primary" disabled block native-type="submit">注册</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage'
}
</script>

<script setup>

import { showToast } from "vant"
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import API from "@/server/api"
const router = useRouter();




let registe_form = reactive({
  user_name: "",
  user_password: "",
})


const onRegisteSubmit = (form) => {// 注册新用户
  API.register(form).then((res) => {
    showToast(res.data.msg);
    if (res.data.code == 0) {
      registe_form = {
        user_name: "",
        user_password: "",
      };
    }
  })
}



</script>

<style scoped lang="scss">
@import "@/assets/sass/register.scss";
</style>