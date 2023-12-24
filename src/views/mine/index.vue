<template>
  <div class="page-mine">
    <div class="login-content" v-if="isLogin" @click="route_to_updateinfo">
      <div class="user-avatar" :style="`background-image:url(${baseURL}${userInfo.user_avatar})`"></div>
      <div class="user-info">
        <div class="user-nickname">{{ userInfo.user_nickname }}</div>
      </div>
    </div>
    <div class="unlogin-content" v-else>
      <div class="user-avatar"></div>
      <div class="user-info">
        <div class="notic" @click="jumpLogin">点击登录</div>
      </div>
    </div>
    <div class="function-content">
      <van-cell title="账号安全" is-link @click="exit"/>
      <van-cell title="退出登录" is-link @click="exit"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MinePage'
}
</script>

<script setup>
  import { showConfirmDialog } from 'vant';
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router';
  import { useStore } from '@/stores/stores';
  import $tool from "aw-util";
  import base_url from '@/server/base_url'

  const store = useStore();
  const router = useRouter();
  const userInfo = reactive(store.userInfo);

  const baseURL = base_url;

  let isLogin = ref(false);
  if (JSON.stringify(userInfo) !== "{}") {
    isLogin.value = true
  }
  
  const jumpLogin = () => {
    router.push("/login");
  }
  const route_to_updateinfo = () => {
    router.push("/userEdit");
  }
  const exit = () => { // 退出登录
    showConfirmDialog({
      title: '确定退出？',
    }).then(() => {
      store.userInfoAction({}) // 存入状态管理
      $tool.operatCookie("del", "user_info");
      $tool.operatCookie("del", "token");

      router.replace("/login");
    })
  }
</script>

<style lang="scss" scoped>
@import "@/assets/sass/mine.scss";
</style>
