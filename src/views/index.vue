<template>
  <div class="page-home">
    <RouterView />
    <BottomBar />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import BottomBar from '@/layout/bottom-bar.vue'

</script>

<style lang="scss" scoped>
#home-view {
  height: calc(100vh - 1.2rem);
  padding-bottom: 1rem;
  overflow-y: scroll;
}

#bottom-bar {
  height: 1.2rem;
  z-index: 9;
}
</style>