<template >
  <div class="page-home">
    <NavBar title="LIGHTHOUSE" color="gray" :leftArrow="false" />
    <div id="area-lottery" class="area-lottery">
      <SlotMachine ref="myLucky" width="7rem" height="4rem" :prizes="prizes" :blocks="blocks"
        :defaultConfig="defaultConfig" :defaultStyle="defaultStyle" :slots="slots" @start="startCallback" />
    </div>
  </div>
</template>
<script setup>
// @start="startCallback" 
// @end="endCallback" 
import NavBar from '@/layout/nav-bar.vue';
import { ref, onMounted } from "vue";
import { getUrl } from "@/utils/util";

const myLucky = ref("")

// 奖励
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
    src: getUrl("images/lottery/monkey.png")
  }]
},
{
  background: '#bac5ee',
  borderRadius: '10px',
  imgs: [{
    width: '60%',
    top: '20%',
    src: getUrl("images/lottery/dog.png")
  }]
},
{
  background: '#bac5ee',
  borderRadius: '10px',
  imgs: [{
    width: '60%',
    top: '20%',
    src: getUrl("images/lottery/pig.png")
  }]
}
];
// 块
const blocks = ref([{ padding: '8px', background: '#869cfa' },
{ padding: '6px', background: '#e9e8fe' },]);

const defaultConfig = {
  rowSpacing: '10px',
  colSpacing: '10px'
}
// 默认样式
const defaultStyle = {
  borderRadius: Infinity,
  background: '#bac5ee',
  fontSize: '32px',
  fontColor: '#333'
}
// 礼物排序
const slots = [
  { order: [0, 1, 2, 3] },
  { order: [0, 1, 2, 3] },
  { order: [0, 1, 2, 3] },
  { order: [0, 1, 2, 3] },
  // { order: [3, 1, 0] },
]
// blocks buttons prizes



const startCallback = () => {
  console.log(myLucky.value)
  myLucky.value.play()
  myLucky.value.stop([1, 1, 1, 1])
}
onMounted(() => {
  startCallback()
})

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