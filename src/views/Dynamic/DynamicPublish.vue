<template>
  <div class="page-dynamic-publish">
    <van-nav-bar title="发动态" left-text="返回" left-arrow @click-left="$router.go(-1)" >
      <template #right>
        <van-button 
          class="btn-public"
          type="primary" 
          size="small"
          block
          @click="dynamicPublick"
        >
          <span>发布</span>
        </van-button>
      </template>
    </van-nav-bar>
    <div class="dynamic-content">
      <div class="dynamic-text">
        <van-field 
          v-model="share_text" 
          rows="4" 
          autosize 
          type="textarea" 
          maxlength="500" 
          placeholder="说点什么吧..."
          show-word-limit 
        />
      </div>
      <div class="dynamic-image">
        <van-uploader v-model="fileList" multiple :max-count="9" accept="image/*" />
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'DynamicUploadPage'
}
</script>

<script setup>
import { ref, reactive } from 'vue';
import { useStore } from '@/stores/stores';
import { showToast } from "vant";
import _API from "@/request/api";
import compressor from "@/utils/compressor"

const _store = useStore();
let share_text = ref('');
let fileList = reactive([]);
let userInfo = _store.userInfo; //用户信息

async function dynamicPublick() {
  let upload_file = fileList.map(item => item.file); // 将所有文件推如数组
  let compressionPromise = [];
  
  upload_file.forEach((item) => {
    compressionPromise.push(compressor(item))
  });
  // let fileData = await Promise.all(compressionPromise).then(fileData => {
  //   fileData.forEach(item => {
  //     formData.append("dynamic_media_file", item);
  //   })
  // })
  let fileData = await Promise.all(compressionPromise);
  let formData = new FormData();
  formData.append("user_id", userInfo.user_id);
  formData.append("dynamic_text", share_text);
  fileData.forEach(file => {
    formData.append("dynamic_media_file", file);
  })

  _API.uploadDynamic(formData).then((res) => {
    showToast(res.data.msg);
    if (res.data.status == 200) {
      share_text = null; // 图书描述
      fileList = []; // 图片数据
      $router.go(-1)
    }
  });
}


</script>
  
<style lang="scss" scoped>
@import "@/assets/sass/Dynamic/DynamicPublish.scss";
</style>