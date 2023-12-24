<template >
  <div class="nav-bar">
    <van-nav-bar v-if="should_nav_show" :fixed="true" :placeholder="true" :title="title" left-text="" left-arrow
      @click-left="router.go(-1)" />
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const should_nav_show = ref(true);
const title = ref('发现')

onBeforeMount(() => {
  if (route.meta.nav_show == 'hide') {
    should_nav_show.value = false
  }
})

</script>
<style scoped lang="scss">
.nav-bar {
  .van-nav-bar,.van-nav-bar__placeholder {
    background-color: rgba(0, 0, 0, 0);

    :deep(.van-icon) {
      color: gray;
    }
  }
  .van-hairline--bottom:after {
    border-bottom-width: 0;
  }
}
</style>