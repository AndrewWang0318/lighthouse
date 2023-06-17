<template>
  <div class="Loading" v-show="loadingSwitch">
    <van-loading size="24">
      <span class="loading-text">加载中...</span>
    </van-loading>
  </div>
</template>

<script setup>
  import { useStore }  from '@/stores/stores';
  // import { ref } from 'vue'
  const _store = useStore();
  let loadingSwitch = _store.loadingSwitch
</script>

<style scoped lang="scss">
.Loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>