<template>
  <div class="page-update-info">
    <van-nav-bar
      title="账户资料"
      left-text="返回"
      left-arrow
      @click-left="router.go(-1)"
    />
    <!-- 用户基本信息列表 -->
    <van-cell-group class="user-basic-info">
      <van-cell class="basic-info-item" title="头像" size="large" is-link @click="basicInfoItemClick('user_avatar')">
        <template #default>
          <div class="user-avatar" :style="`background-image:url(${ baseURL + userInfo.user_avatar })`" ></div>
        </template>
      </van-cell>
      <van-cell class="basic-info-item" title="昵称" size="large" is-link @click="basicInfoItemClick('user_nickname')">
        <template #default>
          <div class="user-nickname">{{userInfo.user_nickname || "暂无"}}</div>
        </template>
      </van-cell>
      <van-cell class="basic-info-item" title="性别" size="large" is-link @click="basicInfoItemClick('user_sex')">
        <template #default>
          <div class="user-sex">{{ { 1: "男", 2: "女" }[userInfo.user_sex] || "保密" }}</div>
        </template>
      </van-cell>
      <van-cell class="basic-info-item" title="出生年月" size="large" is-link @click="basicInfoItemClick('user_birth')">
        <template #default>
          <div class="user-birth">{{userInfo.user_birth || "暂无"}}</div>
        </template>
      </van-cell>
      <van-cell class="basic-info-item" title="个人简介" size="large" is-link @click="basicInfoItemClick('user_signature')">
        <template #default>
          <div class="user-signature">{{userInfo.user_signature || "暂无"}}</div>
        </template>
      </van-cell>
      <van-cell class="basic-info-item" title="城市" size="large" is-link @click="basicInfoItemClick('user_locat')">
        <template #default>
          <div class="user-locat">{{showUserLocal(userInfo.user_locat) || "暂无"}}</div>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 头像修改遮罩 -->
    <van-action-sheet
      v-model:show="avatar_mask"
      :actions="avatar_mask_list"
      @select="avatarSelect"
      @cancel="avatar_mask = false"
      cancel-text="取消"
      close-on-click-action
    />
    <!-- 头像上传组件 -->
    <van-uploader
      v-show="false"
      ref="avatar_uploader"
      :after-read="uploaderAfterRead"
      :max-count="1"
    />

    <!-- 昵称修改遮罩-->
    <van-popup
      v-model:show="nickname_show"
      position="bottom"
      :style="{ width: '100%', height: '40%' }"
    >
      <div class="btn-group">
        <div class="btn-cancel" type="default" @click="nickname_show = false">取消</div>
        <div class="btn-insure" type="success" @click="userBaseInfoUpdate('user_nickname')">确定</div>
      </div>
      <div>
        <van-cell-group inset>
          <van-field v-model="user_info_form.user_nickname" placeholder="请输入昵称" />
        </van-cell-group>
      </div>
    </van-popup>
    <!-- 性别修改弹出框 -->
    <van-overlay :show="sex_dialog_show" @click="sex_dialog_show = false">
      <div class="wrapper">
        <div class="sex-choice" @click.stop>
          <div class="title">性别选择</div>
          <div class="choice-content">
            <div
              class="choice-item"
              v-for="(v, i) in sex_choice_data"
              :style="`background-image:url(${v.img});opacity: ${ user_info_form.user_sex == v.type ? '1' : '0.2'}`"
              @click="sexChange(v)"
            ></div>
          </div>
          <div class="btn-insure" @click="userBaseInfoUpdate('user_sex')">确定</div>
        </div>
      </div>
    </van-overlay>
    <!-- 出生日期选择遮罩 -->
    <van-popup
      v-model:show="birth_choice_show"
      position="bottom"
      :style="{ height: '40%' }"
    >
    <van-date-picker
      v-model="user_info_form.user_birth"
      type="date"
      title="年-月-日"
      :min-date="min_date"
      :max-date="max_date"
      @confirm="userBaseInfoUpdate('user_birth')"
      @cancel="birth_choice_show = false"
    />
    </van-popup>
    <!-- 个人简介修改遮罩 -->
    <van-popup
      v-model:show="signature_show"
      position="bottom"
      :style="{ height: '40%' }"
      @confirm="userBaseInfoUpdate('user_signature')"
    >
      <div class="btn-group">
        <div class="btn-cancel" type="default" @click="signature_show = false">取消</div>
        <div class="btn-insure" type="success" @click="userBaseInfoUpdate('user_signature')">确定</div>
      </div>
      <div>
        <van-cell-group inset>
          <van-field
            v-model="user_info_form.user_signature"
            rows="2"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入个人简介"
            show-word-limit
          />
        </van-cell-group>
      </div>
      
    </van-popup>
    <!-- 城市选择遮罩 -->
    <van-popup
      v-model:show="address_choice_show"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-area
        :area-list="areaList"
        v-model="user_info_form.user_locat"
        @confirm="(val)=>{userBaseInfoUpdate('user_locat',val)}"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "UpdateInfoPage"
}
</script>

<script setup>
  import _API from "@/server/api";
  import { showToast } from "vant";
  import { areaList } from "@vant/area-data";
  import { ref, reactive, getCurrentInstance } from "vue";
  import { useStore } from "@/stores/stores";
  import { useRouter } from "vue-router";
  import base_url from "@/server/base_url";
  import moment from "moment"; // 引入moment时间处理模块
  import { getUrl } from "@/utils/util"
  const store = useStore();
  const router = useRouter();
  const instance = getCurrentInstance();
  const baseURL = base_url;
  let userInfo = store.userInfo;

  
  let avatar_mask = ref(false);
  let avatar_mask_list = [
    { name: "从相册选择", type: 1, avatar_type: 1 },
    { name: "随机", type: 2, avatar_type: 2 },
  ];
  // 头像修改方式选择
  function avatarSelect(item) {
    if (item.type == 1) {
      instance.refs.avatar_uploader.chooseFile();
    } else if (item.type == 2) {
      let param = { user_id: userInfo.user_id, avatar_type: 2 };
      _API.updateUserAvatar(param).then((res) => {
        showToast(res.data.msg);

        // 修补方式
        store.$patch((state) => {
          state.userInfo.user_avatar = res.data.user_avatar
        })
      });
    }
    avatar_mask.value = false;
  }
  // 头像文件读取后上传
  function uploaderAfterRead(item) {
    let formData = new FormData();
    let user_id = userInfo.user_id;
    let avatar_type = 1;
    let avatar_file = item.file;
    formData.append("user_id", user_id);
    formData.append("avatar_type", avatar_type);
    formData.append("avatar_file", avatar_file);
    _API.updateUserAvatar(formData).then((res) => {
      showToast(res.data.msg);
      // 修补方式
      store.$patch((state) => {
        state.userInfo.user_avatar = res.data.user_avatar
      })
    });
  }

  let user_info_form = reactive({
    user_nickname:userInfo.user_nickname,
    user_sex:userInfo.user_sex,
    user_birth: (userInfo.user_birth || moment().format('YYYY-MM-DD') ).split("-"),
    user_signature:userInfo.user_signature,
    user_locat:userInfo.user_locat,
  });
  
   // 修改昵称
  let nickname_show = ref(false);
  // 修改性别
  let sex_dialog_show = ref(false);
  let sex_choice_data = [
    {
      type: 1,
      img: getUrl("images/sex_male.png"),
    },
    {
      type: 0,
      img: getUrl("images/sex_secret.png"),
    },
    {
      type: 2,
      img: getUrl("images/sex_female.png"),
    },
  ];
  const sexChange = (v)=>{
    user_info_form.user_sex = v.type
  }
  // 修改出日期
  let birth_choice_show = ref(false);
  const min_date = new Date('1923-1-1');
  const max_date = new Date();
  // 修改个人简介
  let signature_show = ref(false);
  // 修改城市
  let address_choice_show = ref(false);
  function showUserLocal(v) { // 用户城市code转文字
    if (!v) {
      return v;
    } else {
      let data = v.split(",");
      let province = areaList.province_list[data[0]];
      let city = areaList.city_list[data[1]];
      let county = areaList.county_list[data[2]];
      return `${province}/${city}/${county}`;
    }
  }

  // 基本信息条目修改点击
  function basicInfoItemClick(key) {
    if (key == "user_avatar") {
      avatar_mask.value = true;
    }else if(key == "user_nickname"){
      user_info_form.user_nickname = userInfo.user_nickname
      nickname_show.value = true;
    } else if (key == "user_sex") {
      user_info_form.user_sex = userInfo.user_sex
      sex_dialog_show.value = true;
    } else if (key == "user_birth") {
      let data = userInfo.user_birth || moment().format('YYYY-MM-DD');
      user_info_form.user_birth = data.split("-")
      birth_choice_show.value = true;
    }else if(key == "user_signature"){
      user_info_form.user_signature = userInfo.user_signature
      signature_show.value = true
    } else if (key == "user_locat") {
      user_info_form.user_locat = userInfo.user_locat
      address_choice_show.value = true;
    }
  }

  // 修改基本信息提交
  function userBaseInfoUpdate(key,value){

    // 用户住址单独处理
    let user_locat = user_info_form.user_locat;
    if(key == 'user_locat'){
      user_locat = value.selectedValues.join(",")
    }
    let param = {
      user_id:userInfo.user_id,
      user_nickname:user_info_form.user_nickname,
      user_sex:user_info_form.user_sex,
      user_birth:user_info_form.user_birth.join("-"),
      user_signature:user_info_form.user_signature,
      user_locat,
    }
    _API.updateUserInfo(param).then((res) => {
      showToast(res.data.msg);
      if (res.data.code == 0) {
        if(key == "user_nickname"){
          store.$patch((state) => {
            state.userInfo.user_nickname = param.user_nickname
          })
          nickname_show.value = false
        } else if (key == "user_sex") {
          store.$patch((state) => {
            state.userInfo.user_sex = param.user_sex
          })
          sex_dialog_show.value = false
        } else if (key == "user_birth") {
          store.$patch((state) => {
            state.userInfo.user_birth = param.user_birth
          })
          birth_choice_show.value = false
        } else if (key == "user_signature"){
          store.$patch((state) => {
            state.userInfo.user_signature = param.user_signature
          })
          signature_show.value = false
        } else if (key == "user_locat") {
          store.$patch((state) => {
            state.userInfo.user_locat = param.user_locat
          })
          address_choice_show.value = false
        }

        store.$patch((state) => {
          state.userInfo.user_nickname = param.user_nickname;
          state.userInfo.user_sex = param.user_sex;
          state.userInfo.user_birth = param.user_birth;
          state.userInfo.user_signature = param.user_signature;
          state.userInfo.user_locat = param.user_locat;
        })
      }
    });
  }
</script>

<style scoped lang="scss">
@import "@/assets/sass/UserInfoEdit.scss";
</style>
