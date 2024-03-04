<template >
  <div class="page-home">
    <NavBar title="LIGHTHOUSE" color="gray" :leftArrow="false" />
    <div id="area-lottery" class="area-lottery">
      <SlotMachine ref="myLucky" width="7rem" height="4rem" :prizes="prizes" :blocks="blocks"
        :defaultConfig="defaultConfig" :defaultStyle="defaultStyle" :slots="slots" />
    </div>
  </div>
</template>
<script setup>
// @start="startCallback" 
// @end="endCallback" 
import NavBar from '@/layout/nav-bar.vue';
import { ref } from "vue";
import { getUrl } from "@/utils/util";
// getUrl("images/lottery/chicken.png"),
const prizes = [{
  background: '#bac5ee',
  borderRadius: '10px',
  imgs: [{
    width: '60%',
    top: '20%',
    src: getUrl("images/lottery/chicken.png")
  }]
},
{
  background: '#bac5ee',
  borderRadius: '10px',
  imgs: [{
    width: '60%',
    top: '20%',
    src: getUrl("images/lottery/chicken.png")
  }]
}];
// const prizes = [
//   { fonts: [{ text: '6', top: '15%' }] },
//   { fonts: [{ text: '9', top: '15%' }] },
// ]
const blocks = ref([{ padding: '10px', background: '#869cfa' },
{ padding: '10px', background: '#e9e8fe' },]);
const buttons = ref([12, 3, 4]);
const defaultConfig = {
  rowSpacing: '10px',
  colSpacing: '10px'
}
const defaultStyle = {
  borderRadius: Infinity,
  background: '#bac5ee',
  fontSize: '32px',
  fontColor: '#333'
}
const slots = [
  { order: [1, 0, 1] },
  { order: [1, 0, 1] },
  { order: [0, 1, 0] }
]
// blocks buttons prizes



const startCallback = () => {

}

const endCallback = () => {

}
</script>
<style scoped lang="scss">
.page-home {
  padding-top: 0.2rem;

  .area-lottery {
    display: flex;
    justify-content: center;
  }
}
</style>