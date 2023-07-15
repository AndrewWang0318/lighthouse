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
            <van-divider>任务模块{{ i+1 }}</van-divider>
            <van-field
              v-model="add_plan_form.timeType"
              is-link
              readonly
              name="picker"
              label="周期"
              placeholder="点击选择周期"
              @click="showPicker = true"
            />
            <van-cell 
              title="日期区间" 
              is-link 
              :value="add_plan_form.customTime" 
              @click="show = true" 
            />
            <van-cell-group inset>
              <van-field
                v-for="(vv,ii) in v.task"
                :value="vv" 
                :label="`任务${ii+1}`" 
                placeholder="请输入内容" 
              />
            </van-cell-group>
            <van-button size="mini" plain block type="success" @click="addTask()">添加任务</van-button>
          </div>
          
      </van-cell-group>
    </div>
    <div style="margin: 24px 12px;">
      <van-button block plain type="primary" @click="addBlock()">添加模块</van-button>
    </div>
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>

    <van-calendar v-model:show="show" type="range" @confirm="onConfirm2" />
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

  let add_plan_form = ref({
    name:'弹吉他',
    detail:[
      {
        timeType:1,
        customTime:'',
        task:[
          '早起看书1',
          '早起看书2'
        ]
      },
      {
        timeType:1,
        customTime:'',
        task:[
          '早起锻炼1',
          '早起锻炼2'
        ]
      }
    ]
  })






  const username = ref('');
    const password = ref('');
    const onSubmit = (values) => {
      console.log('submit', values);
    };
    const result = ref('');
    const showPicker = ref(false);
    const columns = [
      { text: '全天', value: 'Hangzhou' },
      { text: '周末', value: 'Ningbo' },
      { text: '周内', value: 'Wenzhou' },
      { text: '自定义', value: 'Shaoxing' }
    ];

    const onConfirm = ({ selectedOptions }) => {
      result.value = selectedOptions[0]?.text;
      showPicker.value = false;
    };

    const date = ref('');
    const show = ref(false);

    const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
    const onConfirm2 = (values) => {
      const [start, end] = values;
      show.value = false;
      date.value = `${formatDate(start)} - ${formatDate(end)}`;
    };
</script>


<style lang="scss" scoped>
@import "@/assets/sass/Plan/AddPlan.scss";
</style>