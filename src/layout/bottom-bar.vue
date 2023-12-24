<template>
  <van-tabbar class="bottom-bar" route active-color="#ee0a24" :border="true">
    <van-tabbar-item
      v-for="(v, i) in bottomBarList"
      :key="i"
      :icon="v.icon"
      :to="v.route"
    >
      <div class="item-text">{{ v.title }}</div>
      <template v-slot:icon>
        <van-icon :name="v.icon" size="0.4rem" />
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
      route: "/home",
      icon: "wap-home",
    },
    {
      title: "动态",
      route: "/socialSquare",
      icon: "fire",
    },
    {
      title: "发现",
      route: "/discover",
      icon: "smile",
    },
    {
      title: "我的",
      route: "/mine",
      icon: "manager",
    },
  ]);
</script>

<style lang="scss" scoped>
.bottom-bar{
  background-color: #fff;
  z-index: 2;
  padding-bottom: 0.14rem;
  padding-top: 0.14rem;
  font-size: 0.26rem;
  .van-badge__wrapper{
    margin-bottom: 0.06rem;
  }
}
</style>