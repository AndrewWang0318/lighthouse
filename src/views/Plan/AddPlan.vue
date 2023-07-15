<template>
  <div class="page-addplan">
    <van-nav-bar
      title="添加计划"
      left-text="返回"
      left-arrow
      @click-left="router.go(-1)"
    />
  </div>
</template>

<script>
export default {
  name: 'AddPlan'
}
</script>

<script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router';
  import { useStore } from '@/stores/stores';
  import $tool from "@/utils/tool";
  import base_url from '@/request/base_url'
  import moment from 'moment';

  const router = useRouter();
</script>

<style scoped>

</style>