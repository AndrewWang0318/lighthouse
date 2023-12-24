<template>
  <div class="page-register">
    <!-- 注册表单 -->
    <van-form @submit="onRegisteSubmit">
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

import { showToast } from "vant"
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import API from "@/server/api"
const router = useRouter();




let registeForm = reactive({
  user_name: "",
  user_password: "",
})


const onRegisteSubmit = (form) => {// 注册新用户
  API.register(form).then((res) => {
    showToast(res.data.msg);
    if (res.data.code == 0) {
      registeForm = {
        user_name: "",
        user_password: "",
      };
      loginForm = form;
    }
  })
}



</script>

<style scoped lang="scss">
@import "@/assets/sass/register.scss";
</style>