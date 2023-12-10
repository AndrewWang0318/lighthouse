<template>
  <van-tabbar class="component-bottom-bar" route active-color="#ee0a24" :border="true">
    <van-tabbar-item
      v-for="(v, i) in bottomBarList"
      :key="i"
      :icon="v.icon"
      :to="v.route"
    >
      <span>{{ v.title }}</span>
      <template v-slot:icon>
        <van-icon :name="v.icon" :size="v.title == '' ? '0.6rem' : '0.36rem'" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
  import { ref } from "vue";
  let bottomBarList = ref([
    {
      title: "首页",
      route: "/Home/PlanDetail",
      icon: "wap-home",
    },
    {
      title: "动态",
      route: "/Home/FriendDynamic",
      icon: "fire",
    },
    {
      title: "我的",
      route: "/Home/Mine",
      icon: "manager",
    },
  ]);
</script>

<style lang="scss" scoped>

</style>