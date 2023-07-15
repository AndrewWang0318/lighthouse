<template>
  <div class="page-panlist">
    <van-nav-bar
      title="计划列表"
      left-text="返回"
      left-arrow
      @click-left="router.go(-1)"
      @click-right="router.push('/AddPlan')"
    >
      <template #right>
        <van-icon name="plus" size="24" />
      </template>
    </van-nav-bar>
    <div class="plan-list">
      <van-cell title="单元格" is-link />

    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanList'
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

<style lang="scss" scoped>
@import "@/assets/sass/Plan/PlanList.scss";
</style>