<template>
  <div class="page-dynamic-publish">
    <van-nav-bar title="发动态" left-text="返回" left-arrow @click-left="$router.go(-1)" >
      <template #right>
        <van-button  class="btn-public" type="primary" size="small" block @click="dynamicPublick">
          <span>发布</span>
        </van-button>
      </template>
    </van-nav-bar>
    <div class="dynamic-content">
      <div class="dynamic-text">
        <van-field 
          v-model="dynamic_content" 
          rows="4" 
          autosize 
          type="textarea" 
          maxlength="500" 
          placeholder="说点什么吧..."
          show-word-limit 
        />
      </div>
      <div class="dynamic-image">
        <van-uploader
          multiple 
          :max-count="9" 
          accept="image/*"
          preview-size="1.6rem"
          v-model="dynamic_file_list"
        />
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
import { useRouter } from "vue-router";
import { showToast } from "vant";
import API from "@/request/api";
import compressor from "@/utils/compressor"

const store = useStore();
const router = useRouter();
let dynamic_content = ref(''); // 发布动态的文字
let dynamic_file_list = ref([]); // 发布动态的文件
async function dynamicPublick() {
  let upload_files = dynamic_file_list.value.map(item => item.file); // 将所有文件推如数组
  let compressor_promise = upload_files.map((item) => compressor(item,0.3));
  let image_data = await Promise.all(compressor_promise);
  let params = new FormData();
  params.append("user_id", store.userInfo.user_id);
  params.append("dynamic_content", dynamic_content.value);
  image_data.forEach(file => {
    params.append("dynamic_media_file", file);
  })

  API.addDynamic(params).then((res) => {
    showToast(res.data.msg);
    if (res.data.code == 0) {
      router.go(-1)
    }
  });
}


</script>
  
<style lang="scss" scoped>
@import "@/assets/sass/Dynamic/DynamicPublish.scss";
</style>