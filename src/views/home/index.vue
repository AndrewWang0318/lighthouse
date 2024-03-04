<template >
  <div class="page-home">
    <NavBar title="LIGHTHOUSE" color="gray" :leftArrow="false" />
    <div id="area-lottery" class="area-lottery">
      <SlotMachine ref="myLucky" width="240px" height="180px" :prizes="prizes" :blocks="blocks" :buttons="buttons"
        @start="startCallback" @end="endCallback" />
    </div>
  </div>
</template>
<script setup>
import NavBar from '@/layout/nav-bar.vue';

import { ref } from "vue";

const prizes = ref([{
  imgs: [
    {
      width: '100%',
      height: '100%',
      src: '/static/images/sex_female.png'
    },
    {
      width: '60%',
      top: '20%',
      src: '/static/images/sex_male.png'
    }
  ]
}, {
  imgs: [
    {
      width: '100%',
      height: '100%',
      src: '/static/images/sex_female.png'
    },
    {
      width: '60%',
      top: '20%',
      src: '/static/images/sex_secret.png'
    }
  ]
}]);
const blocks = ref([{ padding: '10px', background: '#869cfa' },
{ padding: '10px', background: '#e9e8fe' },]);
const buttons = ref([12, 3, 4]);

// blocks buttons prizes



const startCallback = () => {

}

const endCallback = () => {

}
</script>
<style scoped lang="scss"></style>