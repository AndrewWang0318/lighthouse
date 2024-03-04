<template>
  <div class="page-discover">
    <NavBar title="发现" color="gray" :leftArrow="false" />
    <van-cell-group class="row-content">
      <van-cell v-for="(item, index) in discover_list" size="large" :title="item.title" is-link>
        <template #icon>
          <van-icon style="margin-right: 0.3rem;" :name="item.icon" :color="item.iconColor" size="0.42rem" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>
<script setup>
import NavBar from '@/layout/nav-bar.vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();

const discover_list = [
  {
    icon: "eye",
    iconColor: "#07c160",
    title: "每日反思",
    route: "/train"
  },
  {
    icon: "fire",
    iconColor: "#ee0a24",
    title: "小游戏",
    route: "/hrdGame"
  },
]



</script>
<style lang="scss">
.page-discover {
  min-height: 100vh;
  background-color: #f5f5f5;

  .van-cell-group {
    background-color: #f5f5f5;

    .van-cell {
      margin-bottom: 0.2rem;
    }
  }
}
</style>