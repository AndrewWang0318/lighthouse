<template>
  <div class="updateinfodetail_page">
    <van-nav-bar
      :title="`修改${topTitle}`"
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="save"
    />
    <div class="content">
      <van-field
        v-if="type == 'input'"
        v-model="input_value"
        placeholder="请输入昵称"
      />
      <van-field
        v-if="type == 'textarea'"
        v-model="input_value"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入个人简介"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import _API from "@/request/api";
import { Toast } from "vant";
export default {
  name: "UpdateInfoDetail",
  data() {
    return {
      topTitle: "",
      input_value: "",
      type: "input",

      param_key: "",
      userInfo: this.$store.state.UserInfo,
    };
  },
  methods: {
    save() {
      let param_key = this.param_key;
      let input_value = this.input_value;
      let userInfo = this.userInfo;
      let {
        user_id,
        user_name,
        user_nickname,
        user_sex,
        user_birth,
        user_signature,
        user_locat,
      } = userInfo;
      let param = {
        user_id,
        user_name,
        user_nickname,
        user_sex,
        user_birth,
        user_signature,
        user_locat,
      };
      param[param_key] = input_value;

      _API.updateUser(param).then((res) => {
        Toast(res.data.msg);
        if (res.status == 200 && res.data.status == 200) {
          let new_userInfo = Object.assign({}, userInfo, {
            [param_key]: input_value,
          });
          this.$store.dispatch("UserInfoActions", new_userInfo);

          this.$router.go(-1);
        }
      });
    },
  },
  created() {
    let { param_name, param_key, type, param_val } = this.$route.params;
    this.param_key = param_key;
    this.topTitle = param_name;
    this.input_value = param_val;
    this.type = type;
  },
};
</script>

<style></style>
