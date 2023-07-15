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
      <van-cell 
        v-for="(v,i) in plan_list_data" 
        :title="v.name" 
        is-link
        @click="jumpToDetail(v)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanList'
}
</script>

<script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();
  let plan_list = localStorage.getItem('plan_list');

  let plan_list_data = plan_list ? JSON.parse(plan_list) : [];
  function jumpToDetail(v){
    router.push({name:'AddPlan',query:{id:v.id}})
  }
</script>

<style lang="scss" scoped>
@import "@/assets/sass/Plan/PlanList.scss";
</style>