<template>
  <div class="page-discover">
    <NavBar :title="'发现'" :leftArrow="false"/>
    <div class="row-content">
      <van-grid class="setting-area" square :column-num="4">
        <van-grid-item icon="flower-o" text="华容道游戏" @click="router.push('/hrdGame')" />
        <van-grid-item icon="flower-o" text="健身计划" @click="router.push('/train')" />
        <van-grid-item icon="flower-o" text="三省吾身" @click="router.push('/train')" />
        <van-grid-item icon="service-o" text="反馈建议" @click="router.push('/demand')" />
      </van-grid>
    </div>
  </div>
</template>
<script setup>
import NavBar from '@/layout/nav-bar.vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<style lang="">
  
</style>