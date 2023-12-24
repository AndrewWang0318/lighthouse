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
  import { useRouter,useRoute } from "vue-router";
  const router = useRouter();


  let bottomBarList = ref([
    {
      title: "首页",
      route: "/home/index",
      icon: "wap-home",
    },
    {
      title: "动态",
      route: "/home/socialSquare",
      icon: "fire",
    },
    {
      title: "我的",
      route: "/home/mine",
      icon: "manager",
    },
  ]);
</script>

<style lang="scss" scoped>

</style>