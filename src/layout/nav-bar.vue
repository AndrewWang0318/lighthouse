<template >
  <div class="component-nav">
    <van-nav-bar
      :class="color == 'gray' ? 'bg-gray': 'bg-normal'"
      :fixed="true"
      :placeholder="true"
      :title="title"
      left-text=""
      :left-arrow="leftArrow"
      :safe-area-inset-top="true"
      @click-left="router.go(-1)"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';

const { title, leftArrow } = defineProps({
  title: String,
  leftArrow: {
    Boolean,
    default: true
  },
  color: {
    String,
    default: 'normal'
  },
}); // 传递的参数


const router = useRouter();

</script>
<style scoped lang="scss">
.component-nav {
  .bg-gray{
    :deep(.van-nav-bar){
      background: #f5f5f5;
    }
  }
}
</style>