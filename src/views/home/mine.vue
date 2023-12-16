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
      <van-grid class="setting-area" square :column-num="3">
        <van-grid-item icon="underway" text="摸鱼办" @click="router.push('/FishOffice')"/>
        <van-grid-item icon="flower-o" text="游戏合集" @click="router.push('/Game')"/>
        <van-grid-item icon="service-o" text="反馈建议"  @click="router.push('/Demand')"/>
        <van-grid-item icon="revoke" text="退出登录" @click="exit"/>
      </van-grid>
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
  import $tool from "@/utils/tool";
  import base_url from '@/server/base_url'

  const _store = useStore();
  const router = useRouter();
  const userInfo = reactive(_store.userInfo);

  const baseURL = base_url;

  let isLogin = ref(false);
  if (JSON.stringify(userInfo) !== "{}") {
    isLogin.value = true
  }
  
  const jumpLogin = () => {
    router.push("/login");
  }
  const route_to_updateinfo = () => {
    router.push("/UserInfoEdit");
  }
  const exit = () => { // 退出登录
    showConfirmDialog({
      title: '确定退出？',
    }).then(() => {
      _store.userInfoAction({}) // 存入状态管理
      $tool.operatCookie("del", "user_info");
      $tool.operatCookie("del", "token");

      router.replace("/login");
    })
  }
</script>

<style lang="scss" scoped>
@import "@/assets/sass/Mine/Mine.scss";
</style>
