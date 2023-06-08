<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import { Button } from 'vant';
</script>

<template>
  <div class="btn">
    
    <Button type="primary">主要按钮</Button>
  </div>
  <HelloWorld msg="组件引入示例" />
</template>

<style scoped>

</style>
