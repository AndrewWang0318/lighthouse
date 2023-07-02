<template>
  <div class="page-error">
    <component :is="current_components"></component>
  </div>
</template>

<script>
import ErrorCode from "@/views/Error/ErrorCode.vue"
import HuaRongRoad from "@/views/Error/HuaRongRoad.vue"

export default {
  name: 'ErrorPage',
  components:{
    ErrorCode,
    HuaRongRoad
  }
}
</script>

<script setup>
import { ref,onBeforeMount,getCurrentInstance } from 'vue'
const instance = getCurrentInstance();
const $global = instance.appContext.app.config.globalProperties;
const random_num = $global.tool.randomNumber(1,1)
const comopnents_arr = [
  'ErrorCode',
  'HuaRongRoad'
]
let current_components = comopnents_arr[random_num - 1];
</script>

<style lang="scss" scoped>
.page-error{
  min-height: 100vh;
}
</style>