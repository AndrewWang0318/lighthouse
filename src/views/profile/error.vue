<template >
  <div class="page-error">
    <component :is="current_page"></component>
  </div>
</template>

<script>
export default {
  name: 'errorPage'
}
</script>

<script setup>
import codeRain from '@/components/codeRain.vue'
import rain from '@/components/rain.vue'
import $util from "aw-util"
import { shallowRef } from "vue"
const page = [codeRain, rain];
let page_num = $util.randomNumber(0, page.length - 1);
const current_page = shallowRef(page[page_num]);
</script>

<style lang="scsss">
  
</style>