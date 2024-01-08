<template>
  <div class="page-register">
    <NavBar />
    <!-- 登录表单 -->
    <div class="row-form">
      <van-form @submit="onRegisteSubmit">
        <div class="form-content">
          <van-field class="item-form-content" v-model="registe_form.user_name" input-align="center" name="user_name"
            placeholder="用户名" />
          <van-field class="item-form-content" v-model="registe_form.user_password" input-align="center" clearable
            type="password" name="user_password" placeholder="密码" />
          <van-field class="item-form-content" v-model="registe_form.re_user_password" input-align="center" clearable
            type="password" name="re_user_password" placeholder="确认密码" />
        </div>
        <div class="form-function">
          <van-button type="primary" :disabled="!is_pass_reg" block native-type="submit">注册</van-button>
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
import NavBar from '@/layout/nav-bar.vue'
import { showToast } from "vant"
import { ref, reactive,computed } from 'vue'
import { useRouter } from 'vue-router';
import API from "@/server/api"
const router = useRouter();
let registe_form = reactive({
  user_name: "",
  user_password: "",
  re_user_password:""
})

// 是否可以注册
const is_pass_reg = computed(()=>{
  const is_unempty  = registe_form.user_name.trim() != "" && registe_form.user_password.trim() != "" && registe_form.re_user_password.trim() != ""
  const is_same_password = registe_form.user_password == registe_form.re_user_password 
  return is_unempty && is_same_password
}) 

const onRegisteSubmit = (form) => {// 注册新用户
  API.register(form).then((res) => {
    showToast(res.data.msg);
    if (res.data.code == 0) {
      registe_form = {
        user_name: "",
        user_password: "",
      };
      router.push({path:"/home"})
    }
  })
}

// 注册成功后也需要返回token
// 注册成功后直接登录
</script>

<style scoped lang="scss">
@import "@/assets/sass/register.scss";
</style>