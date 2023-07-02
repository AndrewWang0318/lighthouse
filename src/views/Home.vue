<template>
  <div class="page-home">
    <RouterView id="home-view"/>
    <BottomBar id="bottom-bar"/>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import BottomBar from '@/components/BottomBar.vue'
</script>

<style lang="scss" scoped>
#home-view{
  height: calc(100vh - 1.2rem);
  padding-bottom: 1rem;
  overflow-y: scroll;
}
#bottom-bar{
  height: 1.2rem;
  z-index: 9;
}
</style>