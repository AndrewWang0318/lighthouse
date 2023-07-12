<template>
  <div class="page-game">
    <div class="content-nav">
      <van-nav-bar
        title=""
        left-text="返回"
        left-arrow
        @click-left="router.go(-1)"
      />
    </div>
    <div class="game-content">
      <div class="game-item" @click="router.push('/HuaRongRoad')">华容道</div>
      <div class="game-item" @click="router.push('/GoogleDr')">404恐龙</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GamePage'
}
</script>
<script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();
</script>

<style lang="scss" scoped>
@import "@/assets/sass/Mine/Game.scss";
</style>