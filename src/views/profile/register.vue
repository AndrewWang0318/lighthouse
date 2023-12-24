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
          <van-button type="primary" :disabled="is_unregister" block native-type="submit">注册</van-button>
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
import { ref, reactive,watch } from 'vue'
import { useRouter } from 'vue-router';
import API from "@/server/api"
const router = useRouter();
const is_unregister = ref(true) // 免登录开关
let registe_form = reactive({
  user_name: "",
  user_password: "",
  re_user_password:""
})

watch(registe_form,(nval,oval)=>{
  if(nval.user_name.trim() != "" && nval.user_password.trim() != "" && nval.re_user_password.trim() != "" && nval.user_password == nval.re_user_password){
    is_unregister.value = false
  }else{
    is_unregister.value = true
  }
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

// 注册成功后也需要返回token
// 注册成功后直接登录
</script>

<style scoped lang="scss">
@import "@/assets/sass/register.scss";
</style>