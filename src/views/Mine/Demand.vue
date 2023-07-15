<template>
  <div class="page-demand">
    <div class="page-addplan">
      <div class="area-nav">
        <van-nav-bar 
          title="反馈建议" 
          left-text="返回" 
          left-arrow 
          @click-left="router.go(-1)" 
        />
      </div>

      <div class="area-btn">
        <van-button block type="primary">发给小王</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { showConfirmDialog } from 'vant';
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router';
  import { useStore } from '@/stores/stores';
  import $tool from "@/utils/tool";
  import base_url from '@/request/base_url'

  const _store = useStore();
  const router = useRouter();
  const userInfo = reactive(_store.userInfo);

  const baseURL = base_url;
</script>

<style lang="scss" scoped>
@import "@/assets/sass/Mine/Demand.scss";
</style>