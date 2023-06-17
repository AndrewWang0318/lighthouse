<template>
  <div class="page-mine">
    <div class="login-content" v-if="isLogin" @click="route_to_updateinfo">
      <div
        class="user-avatar"
        :style="`background-image:url(${baseURL}${userInfo.user_avatar})`"
      ></div>
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
      <div class="setting-area">
        <div class="setting-item" @click="exit">退出登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive ,getCurrentInstance} from 'vue'
import { useRouter } from 'vue-router';
import { useStore }  from '@/stores/stores';
import $tool from "@/utils/tool";
import base_url from '@/request/base_url'
export default {
  name:'MinePage',
  setup () {
    const _store = useStore();
    const router = useRouter();
    const userInfo = reactive(_store.userInfo);

    const baseURL = base_url;
    
    let isLogin = ref(false);
    if(JSON.stringify(userInfo) !== "{}"){
      isLogin.value = true
    }


    const jumpLogin = () => {
      router.push("/login");
    }
    const route_to_updateinfo = ()  => {
      router.push("/updateInfo");
    }
    const exit = () => { // 退出登录
      _store.userInfoAction({}) // 存入状态管理
      $tool.operatCookie("del", "user_info");
      $tool.operatCookie("del", "token");

      router.replace("/login");
    }
    
    return {
      baseURL,
      isLogin,
      userInfo,
      jumpLogin,
      route_to_updateinfo,
      exit
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/Mine/Mine.scss";
</style>
