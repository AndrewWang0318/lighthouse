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
      <van-grid square :column-num="4">
        <van-grid-item>
          <div class="grid-image"  @click="router.push('/HuaRongRoad')">
            <van-icon name="underway"></van-icon>
          </div>
          <div class="grid-text">华容道</div>
        </van-grid-item>
        <van-grid-item>
          <div class="grid-image" @click="router.push('/GoogleDr')">
            <van-icon name="underway"></van-icon>
          </div>
          <div class="grid-text">谷歌恐龙</div>
        </van-grid-item>
      </van-grid>
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