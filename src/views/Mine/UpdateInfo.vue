<template>
  <div class="update-info">
    <van-nav-bar title="账户资料" left-text="返回" left-arrow @click-left="router.go(-1)" />
    <div class="user-basic-info">
      <div class="basic-info-item" v-for="(v, i) in updateUserInfo" :key="i" @click="open_update(v)">
        <div class="item-content">
          <div class="title">{{ v.name }}</div>
          <div v-if="v.param_key == 'user_avatar'" class="user_avatar"
            :style="`background-image:url(${v.value})`" />

          <div v-else-if="v.param_key == 'user_sex'" class="value">
            {{ v.value == 1 ? "男" : v.value == 2 ? "女" : "保密" }}
          </div>
          <div v-else-if="v.param_key == 'user_locat'" class="value">
            {{ show_user_locat(v.value) }}
          </div>
          <div v-else class="value">{{ v.value }}</div>
          <van-icon name="arrow" class="arrow" />
        </div>
      </div>
    </div>

    <!-- 上传组件 -->
    <div :hidden="true">
      <van-uploader ref="avatar_uploader" :after-read="uploader_after_read" :capture="avatar_uploader_type"
        :max-count="1" />
    </div>
    <!-- 遮罩层弹出框 -->
    <van-overlay :show="sex_overlay" @click="sex_overlay = false">
      <div class="wrapper">
        <div class="sex-choice" @click.stop>
          <div class="title">性别选择</div>
          <div class="choice-content">
            <div class="choice-item" :style="`background-image:url(${v.img});opacity: ${sex_choice == v.type ? '1' : '0.2'
              };`" v-for="(v, i) in sex_choice_data" :key="i" @click="sex_change(v, i)"></div>
          </div>
          <div class="btn-insure" @click="sex_insure">确定</div>
        </div>
      </div>
    </van-overlay>

    <!-- 底部遮罩 -->
    <van-action-sheet v-model:show="bottom_mask" :actions="bottom_mask_choice" @select="bottom_mask_change"
      @cancel="bottom_mask = false" cancel-text="取消" close-on-click-action />
    <!-- 地址选择遮罩 -->
    <van-popup v-model:show="address_choice_show" position="bottom" :style="{ height: '40%' }">
      <van-area :area-list="areaList" :value="current_address_code" @confirm="address_confirm" />
    </van-popup>
    <!-- 出生日期选择遮罩 -->
    <van-popup v-model:show="birth_choice_show" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker v-model="current_birth_date" type="date" title="年-月-日" :min-date="min_date"
        :max-date="max_date" @confirm="birth_confirm" @cancel="birth_choice_show = false" />
    </van-popup>
  </div>
</template>

<script>
import _API from "@/request/api";
import { showToast } from "vant";
import { areaList } from '@vant/area-data';
import { ref, reactive, computed } from 'vue'
import { store } from '@/stores/stores'
import { useRoute,useRouter } from 'vue-router';

export default {
  name: "UpdateInfoPage",
  setup() {
    const _store = store();
    const router = useRouter();
    let bottom_mask = ref(false);
    let bottom_mask_choice = reactive([
      { name: "从相册选择", type: 1, avatar_type: 1 },
      { name: "拍照", type: 2, avatar_type: 1 },
      { name: "随机", type: 3, avatar_type: 2 },
    ])
    let avatar_uploader_type = null // 头像上传的形式
    let sex_overlay = false // 修改性别遮罩
    let sex_choice = 0
    let sex_choice_data = [
      {
        type: 1,
        // img: require("~@/assets/images/sex_male.png"),
        img: new URL('@/assets/images/sex_male.png', import.meta.url).href,
      },
      {
        type: 0,
        // img: require("~@/assets/images/sex_secret.png"),
        img: new URL('@/assets/images/sex_secret.png', import.meta.url).href,
      },
      {
        type: 2,
        // img: require("~@/assets/images/sex_female.png"),
        img: new URL('@/assets/images/sex_female.png', import.meta.url).href,
      },
    ];
    let address_choice_show = false;
    let current_address_code = ''
    let birth_choice_show = false
    let min_date = new Date(1912, 1, 12)
    let max_date = new Date()
    let current_birth_date = new Date()
    let userInfo = _store.userInfo

    let updateUserInfo = computed(()=>{
      let infoArr = [
        { name: "头像", param_key: "user_avatar", value: userInfo.user_avatar },
        { name: "昵称", param_key: "user_nickname", value: userInfo.user_nickname },
        { name: "性别", param_key: "user_sex", value: userInfo.user_sex },
        { name: "出生年月", param_key: "user_birth", value: userInfo.user_birth },
        {
          name: "个性签名",
          param_key: "user_signature",
          value: userInfo.user_signature,
        },
        { name: "地址", param_key: "user_locat", value: userInfo.user_locat },
      ];
      return infoArr;
    })

    function show_user_locat(v)  { // 将地区格式化后显示
      if (!v) {
        return v
      } else {
        let data = v.split(",")
        let province = areaList.province_list[data[0]]
        let city = areaList.city_list[data[1]]
        let county = areaList.county_list[data[2]]
        return `${province}/${city}/${county}`
      }
    }
    function open_update(v) { // 点击需要修改的条目,打开不同的面板
      if (v.param_key == "user_avatar") {
        bottom_mask = true;
      } else if (v.param_key == "user_sex") {
        sex_choice = v.value;
        sex_overlay = true;
      } else if (v.param_key == "user_birth") {
        current_birth_date = new Date(userInfo.user_birth)
        birth_choice_show = true
      } else if (v.param_key == "user_locat") {
        current_address_code = userInfo.user_locat
        address_choice_show = true
      } else {
        let str_userInfo = JSON.stringify(userInfo);
        let param_name = v.name;
        let param_key = v.param_key;
        let param_val = v.value;

        let type = "input";
        if (param_key == "user_nickname") type = "input";
        if (param_key == "user_signature") type = "textarea";

        router.push({
          name: "UpdateInfoDetail",
          params: {
            param_name,
            param_key,
            param_val,
            type,
            userInfo:str_userInfo,
          },
        });
      }
    }
    function bottom_mask_change(v) { // 头像遮罩选择后
      let user_id = userInfo.user_id;
      let user_name = userInfo.user_name;
      if (v.type == 1) {
        avatar_uploader_type = null; // 关闭拍照模式,使用相册模式[存在延迟，存在延迟吊起照相机]
        setTimeout(() => {
          $refs.avatar_uploader.chooseFile();
        }, 100);
      } else if (v.type == 2) {
        avatar_uploader_type = "camera"; // 关闭拍照模式,使用相册模式
        setTimeout(() => {
          $refs.avatar_uploader.chooseFile();
        }, 100);
      } else {
        let param = { user_id, user_name, avatar_type: 2 };
        _API.updateUserAvatar(param).then((res) => {
          showToast(res.data.msg);

          let user_avatar = res.data.user_avatar;

          let new_userInfo = Object.assign({}, userInfo, { user_avatar });



          _store.userInfoAction(new_userInfo);

        });
      }
      bottom_mask = false;
    }
    function uploader_after_read(v) { // 读取头像后
      let formData = new FormData();
      let user_id = userInfo.user_id;
      let user_name = userInfo.user_name;
      let avatar_type = 1;
      let avatar_file = v.file;
      formData.append("user_id", user_id);
      formData.append("user_name", user_name);
      formData.append("avatar_type", avatar_type);
      formData.append("avatar_file", avatar_file);

      _API.updateUserAvatar(formData).then((res) => {
        showToast(res.data.msg);

        let user_avatar = res.data.user_avatar;
        let new_userInfo = Object.assign({}, userInfo, { user_avatar });

        _store.userInfoAction(new_userInfo);

      });
    }
    function sex_change(v) { // 选择性别
      sex_choice = v.type;
    }
    function sex_insure() { // 确认修改性别
      user_sex = sex_choice;
      let param = {
        user_id:userInfo.user_id,
        user_name:userInfo.user_name,
        user_nickname:userInfo.user_nickname,
        user_sex:userInfo.user_sex,
        user_birth:userInfo.user_birth,
        user_signature:userInfo.user_signature,
        user_locat:userInfo.user_locat,
      };
      _API.updateUser(param).then((res) => {
        showToast(res.data.msg);
        if (res.status == 200 && res.data.status == 200) {
          let new_userInfo = Object.assign({}, userInfo, { user_sex });


          _store.userInfoAction(new_userInfo);

          sex_overlay = false;
        }
      });
    }
    function address_confirm(result) {// 确定修改地址
      let address_code = []
      result.forEach(item => {
        address_code.push(item.code)
      })
      current_address_code = address_code.join()

      user_locat = current_address_code;
      let param = {
        user_id:userInfo.user_id,
        user_name:userInfo.user_name,
        user_nickname:userInfo.user_nickname,
        user_sex:userInfo.user_sex,
        user_birth:userInfo.user_birth,
        user_signature:userInfo.user_signature,
        user_locat:userInfo.user_locat,
      };
      _API.updateUser(param).then((res) => {
        showToast(res.data.msg);
        if (res.status == 200 && res.data.status == 200) {
          let new_userInfo = Object.assign({}, userInfo, { user_locat });

          _store.userInfoAction(new_userInfo);

          address_choice_show = false;
        }
      });
    }
    function birth_confirm(result) { // 确定修改出生日期
      current_birth_date = $moment(result).format('YYYY-MM-DD')

      user_birth = current_birth_date;
      let param = {
        user_id:userInfo.user_id,
        user_name:userInfo.user_name,
        user_nickname:userInfo.user_nickname,
        user_sex:userInfo.user_sex,
        user_birth:userInfo.user_birth,
        user_signature:userInfo.user_signature,
        user_locat:userInfo.user_locat,
      };
      _API.updateUser(param).then((res) => {
        showToast(res.data.msg);
        if (res.status == 200 && res.data.status == 200) {
          let new_userInfo = Object.assign({}, userInfo, { user_birth });

          _store.userInfoAction(new_userInfo);

          birth_choice_show = false;
        }
      });
    }
    return {
      bottom_mask,
      bottom_mask_choice,
      areaList,
      avatar_uploader_type,
      sex_overlay,
      sex_choice,
      sex_choice_data,
      address_choice_show,
      current_address_code,
      birth_choice_show,
      min_date,
      max_date,
      current_birth_date,
      userInfo,
      updateUserInfo,
      router,
      
      show_user_locat,
      open_update,
      bottom_mask_change,
      uploader_after_read,
      sex_change,
      sex_insure,
      address_confirm,
      birth_confirm
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/Mine/UpdateInfo.scss";
</style>
