<template>
  <div class="page-home">
    <RouterView />
    <BottomBar />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import BottomBar from '@/components/BottomBar.vue'
</script>

<style lang="scss" scoped>

</style>