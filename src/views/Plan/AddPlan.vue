<template>
  <div class="page-addplan">
    <div class="page-nav">
      <van-nav-bar
        title="添加计划"
        left-text="返回"
        left-arrow
        @click-left="router.go(-1)"
        @click-right="submit"
      >
        <template #right>
          <van-button size="small" type="primary">确定</van-button>
        </template>
      </van-nav-bar>
    </div>
    
    <div class="plan-form">
      <van-cell-group inset>
        <van-divider>计划信息</van-divider>
          <van-field
            v-model="add_plan_form.name"
            name="名称"
            label="名称"
            placeholder="名称"
          />
       
          <div class="" v-for="(v,i) in add_plan_form.detail">
            <van-divider>
              <span style="margin-right: 0.6rem;">任务模块{{ i+1 }} </span>
              <van-button v-if="add_plan_form.detail.length > 1" size="mini" type="warning" @click="removeBlock(i)">删除</van-button>
            </van-divider>
            <van-field
              v-model="add_plan_form.detail[i].timeType_text"
              is-link
              readonly
              name="picker"
              label="周期"
              placeholder="点击选择周期"
              @click="datetypePopClick(i)"
            />
            
            <van-cell
              v-if="add_plan_form.detail[i].timeType == 'custom'"
              is-link
              @click="dateTimeClick(i)" 
            >
              <template #title>
                <div style="display: flex; align-items: center;">
                  <span class="custom-title" style="flex-shrink: 0;margin-right: 1.4rem;">区间</span>
                  <span class="custom-value">{{ add_plan_form.detail[i].customTime }}</span>
                </div>
              </template>
            </van-cell>

            <van-cell-group inset>
              <van-cell v-for="(vv,ii) in v.task" :title="`任务${ii+1}`" style="display: flex;align-items: center;">
                <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                <template #title>
                  <div style="display: flex; align-items: center;">
                    <span class="custom-title" style="flex-shrink: 0;margin-right: 0.2rem;">任务{{ii+1}}</span>
                    <van-field v-model="v.task[ii]" label="" placeholder="请输入内容" />
                  </div>
                </template>
                <template #right-icon>
                  <van-button v-if="v.task.length > 1" size="mini" type="warning" @click="removeTask(i,ii)">删除</van-button>
                </template>
              </van-cell>
            </van-cell-group>
            <van-button size="mini" plain block type="success" @click="addTask(i)">添加任务</van-button>
          </div>
      </van-cell-group>
    </div>
    <div style="margin: 24px 12px;">
      <van-button block plain type="primary" @click="addBlock()">添加模块</van-button>
    </div>


    <!-- 周期类型弹窗 -->
    <van-popup v-model:show="datetype_pop_show" position="bottom">
      <van-picker
        :columns="datetype_columns"
        @confirm="datetypeConfirm"
        @cancel="datetype_pop_show = false"
      />
    </van-popup>
    <!-- 日历类型 -->
    <van-calendar 
      v-model:show="datetime_pop_show" 
      type="range"
      :max-date="max_date"
      @confirm="dateTimeConfirm" 
    />
  </div>
</template>

<script>
export default {
  name: 'AddPlan'
}
</script>

<script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router';
  import { useStore } from '@/stores/stores';
  import $tool from "@/utils/tool";
  import base_url from '@/request/base_url'
  import moment from 'moment';

  const router = useRouter();
  const max_date = moment(moment().add(3,'year')).toDate(); // 最大日期
  const datetime_pop_show = ref(false); // 周期区间弹窗展示
  let datetype_pop_show = ref(false); // 周期类型弹窗展示
  let current_datetype_idx = ref(0); // 当前日期类型点击的哪一项
  let current_datetime_idx = ref(0); // 当前日期区间点击的哪一项
  
  // 周期类型
  const datetype_columns = [
    { text: '全天', value: 'all' },
    { text: '周末', value: 'week' },
    { text: '周内', value: 'work' },
    { text: '自定义', value: 'custom' }
  ];
  let add_plan_form = ref({
    name:'',
    detail:[
      {
        timeType:'all',
        customTime:'',
        task:[
          '',
        ]
      }
    ]
  })

  // 周期类型点击
  function datetypePopClick(i){
    current_datetype_idx.value = i;
    datetype_pop_show.value = true
  }
  // 周期类型确定
  const datetypeConfirm = ({ selectedOptions }) => {
    add_plan_form.value.detail[current_datetype_idx.value].timeType_text = selectedOptions[0]?.text
    add_plan_form.value.detail[current_datetype_idx.value].timeType = selectedOptions[0]?.value
    datetype_pop_show.value = false;
  };
  // 周期区间点击
  function dateTimeClick(i){
    current_datetime_idx.value = i;
    datetime_pop_show.value = true
  }
  // 周期区间确定
  const dateTimeConfirm = (values) => {
    const [start, end] = values;
    let start_text = moment(start).format('YYYY-MM-DD')
    let end_text = moment(end).format('YYYY-MM-DD')
    let text = `${start_text},${end_text}`
    add_plan_form.value.detail[current_datetime_idx.value].customTime = text
    datetime_pop_show.value = false;
  };
  // 添加任务
  function addTask(i){
    add_plan_form.value.detail[i].task.push('')
  }
  function removeTask(i,ii){
    add_plan_form.value.detail[i].task.splice(ii,1)
  }
  // 添加模块
  function addBlock(i){
    add_plan_form.value.detail.push(
      {
        timeType:1,
        customTime:'',
        task:[
          ''
        ]
      }
    )
  }
  function removeBlock(i){
    add_plan_form.value.detail.splice(i,1)
  }
  // 提交
  function submit(){
    


    let plan_list = localStorage.getItem('plan_list');
    add_plan_form.value.id = moment().valueOf();
    if(plan_list){
      let data = JSON.parse(plan_list)
      data.push(add_plan_form.value)
      localStorage.setItem('plan_list',JSON.stringify(data))
    }else{
      let data = [];
      data.push(add_plan_form.value);
      localStorage.setItem('plan_list',JSON.stringify(data))
    }
  }
    
    
    
    
</script>


<style lang="scss" scoped>
@import "@/assets/sass/Plan/AddPlan.scss";
</style>