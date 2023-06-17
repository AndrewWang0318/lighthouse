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

    <!-- 头像选择底部遮罩 -->
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
    <!-- 遮罩层弹出框 -->
    <van-overlay :show="sex_overlay" @click="sex_overlay.value = false">
      <div class="wrapper">
        <div class="sex-choice" @click.stop>
          <div class="title">性别选择</div>
          <div class="choice-content">
            <div
              class="choice-item"
              :style="`background-image:url(${v.img});opacity: ${
                sex_choice == v.type ? '1' : '0.2'
              };`"
              v-for="(v, i) in sex_choice_data"
              :key="i"
              @click="sex_change(v, i)"
            ></div>
          </div>
          <div class="btn-insure" @click="sex_insure">确定</div>
        </div>
      </div>
    </van-overlay>

    <!-- 地址选择遮罩 -->
    <van-popup
      v-model:show="address_choice_show"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-area
        :area-list="areaList"
        :value="current_address_code"
        @confirm="address_confirm"
      />
    </van-popup>
    <!-- 出生日期选择遮罩 -->
    <van-popup
      v-model:show="birth_choice_show"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-datetime-picker
        v-model="current_birth_date"
        type="date"
        title="年-月-日"
        :min-date="min_date"
        :max-date="max_date"
        @confirm="birth_confirm"
        @cancel="birth_choice_show = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
  import _API from "@/request/api";
  import { showToast } from "vant";
  import { areaList } from "@vant/area-data";
  import { ref, reactive, computed, getCurrentInstance } from "vue";
  import { useStore } from "@/stores/stores";
  import { useRoute, useRouter } from "vue-router";
  import base_url from "@/request/base_url";
  const _store = useStore();

  const router = useRouter();
  const instance = getCurrentInstance();
  const baseURL = base_url;
  let userInfo = _store.userInfo;

  

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
        _store.$patch((state) => {
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
      _store.$patch((state) => {
        state.userInfo.user_avatar = res.data.user_avatar
      })
    });
  }

  let sex_overlay = ref(false); // 修改性别遮罩
  let sex_choice = ref(0);
  let sex_choice_data = [
    {
      type: 1,
      img: new URL("@/assets/images/sex_male.png", import.meta.url).href,
    },
    {
      type: 0,
      img: new URL("@/assets/images/sex_secret.png", import.meta.url).href,
    },
    {
      type: 2,
      img: new URL("@/assets/images/sex_female.png", import.meta.url).href,
    },
  ];
  let address_choice_show = false;
  let current_address_code = "";
  let birth_choice_show = false;
  let min_date = new Date(1912, 1, 12);
  let max_date = new Date();
  let current_birth_date = new Date();
  function showUserLocal(v) {
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

  function sex_change(v) {
    sex_choice.value = v.type;
  }
  function sex_insure() {
    user_sex = sex_choice;
    let param = {
      user_id: userInfo.user_id,
      user_name: userInfo.user_name,
      user_nickname: userInfo.user_nickname,
      user_sex: userInfo.user_sex,
      user_birth: userInfo.user_birth,
      user_signature: userInfo.user_signature,
      user_locat: userInfo.user_locat,
    };
    _API.updateUser(param).then((res) => {
      showToast(res.data.msg);
      if (res.status == 200 && res.data.status == 200) {
        let new_userInfo = Object.assign({}, userInfo, { user_sex });
        _store.userInfoAction(new_userInfo);
        sex_overlay.value = false;
      }
    });
  }
  function address_confirm(result) {
    let address_code = [];
    result.forEach((item) => {
      address_code.push(item.code);
    });
    current_address_code = address_code.join();
    user_locat = current_address_code;
    let param = {
      user_id: userInfo.user_id,
      user_name: userInfo.user_name,
      user_nickname: userInfo.user_nickname,
      user_sex: userInfo.user_sex,
      user_birth: userInfo.user_birth,
      user_signature: userInfo.user_signature,
      user_locat: userInfo.user_locat,
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
  function birth_confirm(result) {
    current_birth_date = $moment(result).format("YYYY-MM-DD");
    user_birth = current_birth_date;
    let param = {
      user_id: userInfo.user_id,
      user_name: userInfo.user_name,
      user_nickname: userInfo.user_nickname,
      user_sex: userInfo.user_sex,
      user_birth: userInfo.user_birth,
      user_signature: userInfo.user_signature,
      user_locat: userInfo.user_locat,
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


  // 基本信息条目修改点击
  function basicInfoItemClick(key) {
    if (key == "user_avatar") {
      avatar_mask.value = true;
    } else if (key == "user_sex") {
      sex_choice = value;
      sex_overlay.value = true;
    } else if (key == "user_birth") {
      current_birth_date = new Date(userInfo.user_birth);
      birth_choice_show = true;
    } else if (key == "user_locat") {
      current_address_code = userInfo.user_locat;
      address_choice_show = true;
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
          userInfo: str_userInfo,
        },
      });
    }
  }
</script>

<style scoped lang="scss">
@import "@/assets/sass/Mine/UpdateInfo.scss";
</style>
