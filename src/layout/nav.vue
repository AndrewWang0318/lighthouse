<template >
  <van-nav-bar
    class="layout-nav"
    v-if="should_nav_show"
    title=""
    left-text=""
    left-arrow
    @click-left="router.go(-1)"
  />
</template>
<script setup>
import { ref,onBeforeMount } from "vue";
import { useRoute,useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const should_nav_show = ref(true);
onBeforeMount(()=>{
  if(route.meta.nav_show == 'hide'){
  should_nav_show.value = false
}
})

</script>
<style lang="scss">

</style>