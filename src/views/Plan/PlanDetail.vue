<template>
  <div class="page-plan-detail">
    计划列表
    <div class="btn-add-plan"></div>
    <div class="btn-change-theme"></div>
    <div class="btn-plan-list"></div>
  </div>
</template>

<script>
export default {
  name: 'PlanPage'
}
</script>


<script setup>
 import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router';
  import { useStore } from '@/stores/stores';
  import $tool from "@/utils/tool";
  import base_url from '@/request/base_url'
</script>

<style lang="scss" scoped>
@import "@/assets/sass/Plan/Plan.scss";
</style>