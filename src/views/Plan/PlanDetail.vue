<template>
  <div class="page-plan-detail">
    <div class="row-banner">
      <div class="area-time">
        <span>距离{{ current_date }}结束:&nbsp;</span>
        <van-count-down millisecond :time="time" format="HH:mm:ss" />
      </div>
      <div class="area-process">
        <van-circle v-model:current-rate="currentRate" :rate="currentRate" :speed="100" :text="text" :stroke-width="100"
          size="0.8rem" />
      </div>
      <div class="area-btn-group">
        <div class="btn-plan-list">
          <van-button icon="orders-o" type="primary" size="small" @click="router.push('/PlanList')" />
        </div>
      </div>
    </div>

    <div class="row-plan-list">
      <van-swipe-cell v-for="v in plan_detail_list">
        <div :class="`item-row-plan-list ${v.is_done ? 'done' : ''}`" v-touch:swipe.right="() => { swiperRight(v) }">
          <span class="text">{{ v.title }}</span>
        </div>
      </van-swipe-cell>
    </div>
    <div class="btn-add-plan"></div>
    <div class="btn-change-theme"></div>
    <div class="btn-plan-list"></div>
  </div>
</template>

<script>
export default {
  name: 'PlanPage'
}
</script>


<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/stores/stores';
import $tool from "@/utils/tool";
import base_url from '@/request/base_url'
import moment from 'moment';


const router = useRouter();
const current_date = moment().format('MM-DD');
const now_time = moment();
const end_time = moment().endOf('day') //当天23点59分59秒以13位Unix时间戳输出（毫秒）;
const diff_milliseconds = end_time.diff(now_time, "milliseconds")
const time = ref(diff_milliseconds);
const plan_detail_list = ref([])

let plan_list = localStorage.getItem('plan_list');
let plan_list_data = JSON.parse(plan_list) || [];

let plan_detail_list_local = localStorage.getItem(`plan_detail_list${now_time.format('YYYYMMDD')}`);
if (plan_detail_list_local && plan_detail_list_local !== "[]") {

  let plan_detail_list_data = JSON.parse(plan_detail_list_local) || [];

  plan_detail_list.value = plan_detail_list_data
} else {
  let detail_data = []
  plan_list_data.forEach(v => {
    v.detail.forEach(vv => {

      vv.task.forEach(vvv => {
        if (vv.customTime.length !== 0) {
          let time = vv.customTime.split(",");
          // 当前日期在此之间
          if (now_time.isSameOrAfter(time[0]) && now_time.isSameOrBefore(time[1])) {
            if (vv.timeType == "every") {
              detail_data.push({
                title: vvv,
                is_done: 0,
              })
            }
            if (vv.timeType == "work") {
              if (now_time.day() != 0 && now_time.day() != 6) {
                detail_data.push({
                  title: vvv,
                  is_done: 0,
                })
              }
            }
            if (vv.timeType == "week") {
              if (now_time.day() == 0 || now_time.day() == 6) {
                detail_data.push({
                  title: vvv,
                  is_done: 0,
                })
              }
            }
          }
        } else {
          if (vv.timeType == "every") {
            detail_data.push({
              title: vvv,
              is_done: 0,
            })
          }
          if (vv.timeType == "work") {
            if (now_time.day() != 0 && now_time.day() != 6) {
              detail_data.push({
                title: vvv,
                is_done: 0,
              })
            }
          }
          if (vv.timeType == "week") {
            if (now_time.day() == 0 || now_time.day() == 6) {
              detail_data.push({
                title: vvv,
                is_done: 0,
              })
            }
          }
        }
      })

    })
  });
  plan_detail_list.value = detail_data;
  localStorage.setItem(`plan_detail_list${now_time.format('YYYYMMDD')}`,JSON.stringify(detail_data))
}





// 一份大小
const one_point = Number((100 / plan_detail_list.value.length).toFixed(2))
let is_done_list = plan_detail_list.value.filter(v => v.is_done == true)
let text = ref('')
let currentRate = ref(0);
if(plan_detail_list.value.length > 0){
  text.value = is_done_list.length * one_point + '%'
  currentRate.value = Math.round(is_done_list.length * one_point);
}
function swiperRight(v) {
  v.is_done = !v.is_done;

  is_done_list = plan_detail_list.value.filter(v => v.is_done == true);

  text.value = Math.round(is_done_list.length * one_point) + '%';
  currentRate.value = Math.round(is_done_list.length * one_point);

  localStorage.setItem(`plan_detail_list${now_time.format('YYYYMMDD')}`,JSON.stringify(plan_detail_list.value))
}

</script>

<style lang="scss" scoped>
@import "@/assets/sass/Plan/PlanDetail.scss";
</style>