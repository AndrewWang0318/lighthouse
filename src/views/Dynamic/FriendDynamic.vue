<template>
  <div class="page-friend-dynamic">
    <!-- 用户背景展示区 -->
    <div class="user-background-area" :style="`background-image: url(${base_url + store.userInfo.user_bg});`">
      <div class="user-info-content">
        <div class="user-name">{{ store.userInfo.user_nickname }}</div>
        <div class="user-avatar" :style="`background-image: url(${base_url + store.userInfo.user_avatar});`"></div>
      </div>
      <!-- 发动态按钮 -->
      <div class="btn-upload-dynamic" ref="btn_upload" @click="router.push('/DynamicPublish')">
        <van-icon name="plus" size='0.34rem' color="#ffffff" />
      </div>
    </div>
    <div class="dynamic-area">
      <div class="dynamic-item" v-for="(v, i) in dynamicDataList">
        <div class="dynamic-header">
          <div class="user-avatar" :style="`background-image:url(${base_url + v.user_avatar})`"></div>
          <div class="dynamic-info">
            <div class="user-nickname">{{ v.user_nickname }}</div>
            <div class="dynamic-content">{{ v.dynamic_content }}</div>
          </div>
        </div>
        <div class="dynamic-show">
          <div class="dynamic-show-item" v-for="(vv, ii) in v.dynamic_media_data"
            :style="`background-image:url(${base_url + vv.url})`" @click="mediaPreview(v.dynamic_media_data, ii)">
          </div>
        </div>
        <div class="dynamic-function">
          <div class="dynamic-time">{{ v.dynamic_time }}</div>
          <div class="dynamic-more">
            <div class="more-ico" 
              @click="jumpInteract(i)"
              v-clickout="jumpInteractOut(i)"
            >
              <div class="ico"> <van-icon name="ellipsis" /> </div>
            </div>
            <div class="more-content" ref="moreContent">
              <div class="like-btn" @click="addLike(v, i)">
                <van-icon name="like-o" style="pointer-events: none;" />
                <div class="text" style="pointer-events: none;">{{ v.is_liked ? '取消' : '赞' }}</div>
              </div>
              <div class="separate"></div>
              <div class="comment-btn" @click="addComment(v, i)">
                <van-icon name="comment-o" style="pointer-events: none;" />
                <div style="pointer-events: none;" class="text">评论</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="dynamic-feedback">
          <div class="like-show" v-show="v.liked_user.length > 0">
            <van-icon class="like-ico" name="like-o" />
            <div class="like-user">{{ v.liked_user.join(",") }}</div>
          </div>
          <Reply :dynamicItem="v" :commentData="v.comment_content" @transfer_data="choiceClick" />
        </div> -->
      </div>
    </div>
    <!-- 输入框 -->
    <div class="comment-public" v-show="should_comment_show">
      <van-field class="comment-input" ref="commentInput" v-model="comment_text" :placeholder="comment_placeholder"
        @keyup="comment_keyup" />
      <div class="btn-send" @click="sendComment">发送</div>
    </div>
    <!-- 浏览图片 -->
    <van-image-preview v-model:show="img_preview_show" :images="img_preview_arr"
      :start-position="img_preview_start"></van-image-preview>
  </div>
</template>

<script>
export default {
  name: "FriendDynamicPage",
}
</script>

<script setup async>
import { getCurrentInstance, ref, reactive, onBeforeMount, computed, watch } from 'vue';
import { useStore } from '@/stores/stores';
import { useRouter } from "vue-router";
import anime from "animejs"; // 引入动画js库
import moment from "moment"; // 引入moment时间处理模块
import { showToast } from "vant";
import $tool from "@/utils/tool"
import base_url from '@/request/base_url';
import Reply from '@/views/Dynamic/components/Reply.vue'
import API from "@/request/api";

const router = useRouter();
const instance = getCurrentInstance();
const store = useStore();


// 动态数据
let dynamicData = ref([]);
let page = ref(1);
let limit = ref(10);
// 动态图片预览图展示
let img_preview_arr = reactive([]);
let img_preview_show = ref(false);
let img_preview_start = ref(0);


let currentIndex = ref(null); // 当前点击的某一项

let comment_text = ref(null);
let comment_placeholder = ref('请输入...');
let should_comment_show = ref(false);
let comment_focus = ref(false);
let current_dynamic_id = ref(null);
let comment_to_user_id = ref(0); // 评论的用户的id
let comment_parent_id = ref(0); // 评论的父级id
let module_id = ref(4);

let dynamicDataList = computed(() => {
  return dynamicData.value.map(item => {
    const { dynamic_id, dynamic_user, dynamic_content } = item
    // 媒体文件地址及其信息
    let dynamic_media = item.dynamic_media || '';
    let dynamic_media_arr = dynamic_media.split(",")
    let dynamic_media_data = dynamic_media_arr.map(v => {
      let file_extension = v.slice(v.lastIndexOf(".") + 1).toLowerCase();// 文件后缀名[小写]
      return { url: v, type: $tool.checkFileType(file_extension) }
    })
    let dynamic_time = moment(item.createdAt).fromNow();// 距离当前时间
    // // 评论的数据
    // let comment_content = []
    // // 回复的数据
    // let reply_content = []
    // item.dynamic_comment.forEach((item) => {
    //   if (item.comment_parent_id == 0) {
    //     comment_content.push({
    //       main_comment: {
    //         comment_id: item.comment_id,
    //         comment_parent: item.comment_parent,
    //         comment_parent_id: item.comment_parent_id,
    //         comment_user: item.comment_user,
    //         from_user_id: item.comment_user.user_id,
    //         to_user_id: item.comment_to_user_id,
    //         name: item.comment_user.user_nickname,
    //         text: item.comment_text,
    //       },
    //       minor_comment: []
    //     })
    //   } else {
    //     reply_content.push({
    //       main_comment: {
    //         comment_id: item.comment_id,
    //         comment_parent: item.comment_parent,
    //         comment_parent_id: item.comment_parent_id,
    //         comment_user: item.comment_user,
    //         from_user_id: item.comment_user.user_id,
    //         to_user_id: item.comment_to_user_id,
    //         name: item.comment_user.user_nickname,
    //         text: item.comment_text,
    //       },
    //       minor_comment: []
    //     })
    //   }
    // })
    // dealReply(comment_content, reply_content)
    // function dealReply(comment_content, reply_content) { // 递归展示
    //   if (reply_content.length <= 0) return;
    //   comment_content.forEach(v => { // 第一层
    //     reply_content.forEach((vv, ii) => { // 所有的回复
    //       let comment_parent_id = vv.main_comment.comment_parent_id
    //       let comment_id = v.main_comment.comment_id
    //       if (comment_parent_id == comment_id) {
    //         v.minor_comment.push(vv)
    //         reply_content.splice(ii, 1)
    //       }
    //     })
    //     dealReply(v.minor_comment, reply_content)
    //   })

    // }
    //点赞数据
    // let dynamic_like = item.dynamic_like
    // let liked_user = [] // 点赞人名文本
    // let is_liked = false; // 是否已经点过赞
    // dynamic_like.forEach(item => {
    //   if (store.userInfo.user_id == item.like_user.user_id) is_liked = true // 本人id出现过点赞列表中
    //   liked_user.push(item.like_user.user_nickname)
    // })
    return {
      lc_show: false,
      dynamic_id,
      user_avatar: dynamic_user.user_avatar,
      user_nickname: dynamic_user.user_nickname,
      dynamic_content,
      dynamic_media_data,
      dynamic_time,
      // dynamic_show,
      // dynamic_time,
      // liked_user,
      // dynamic_like,
      // comment_content,
    }
  })
});
initData();

function initData() { // 初始化数据
  let parmas = { limit: limit.value, page: page.value };
  API.getDynamicList(parmas).then((res) => {
    if (res.data.code == 0) {
      dynamicData.value = res.data.data
    }
  });
}
function mediaPreview(data, idx) { // 预览图大图展示
  img_preview_arr = data.map(item => {
    return base_url + item.url
  })
  img_preview_start.value = idx
  img_preview_show.value = true
}


function jumpInteract(i) { // 点击点赞及评论按钮
  currentIndex = i;
  dynamicDataList.value.forEach((item, index) => { // 关闭其他的dom
    let dom = instance.refs.moreContent[index]
    if (item.lc_show && index !== i) { // 点赞评论在展示且不是当前目标的dom
      item.lc_show = false
      anime({ targets: dom, easing: "cubicBezier(.18,.07,.24,.99)", width: "0", duration: 150, });
    }
  })
  dynamicDataList.value[i].lc_show = !dynamicDataList.value[i].lc_show;
  let item = instance.refs.moreContent[i];
  if (dynamicDataList.value[i].lc_show) {
    anime({ targets: item, width: "3rem", duration: 300, });
  } else {
    anime({ targets: item, easing: "cubicBezier(.18,.07,.24,.99)", width: "0", duration: 150, });
  }
}
function jumpInteractOut(i){ // 点击点赞及评论按钮之外
  console.log(i)
}


function addLike(v, i) { // 点击赞
  let user_id = store.userInfo.user_id
  let like_guide_id = v.dynamic_id
  let module_id = 4
  if (v.is_liked) {// 取消赞
    let like_id = null;
    v.dynamic_like.forEach(item => {
      if (user_id == item.like_user.user_id) like_id = item.like_id
    })
    let parmas = { like_id, user_id };
    API.cancelLike(parmas).then(res => {
      if (res.data.status !== 200) showToast(res.data.message)
      initData()
    })
  } else { // 点赞
    let parmas = { like_guide_id, module_id, user_id }
    API.addLike(parmas).then(res => {
      if (res.data.status !== 200) showToast(res.data.message)
      initData()
    })
  }
  jumpInteract(i)
}
function addComment(v, i) { // 点击评论
  jumpInteract(i)
  comment_placeholder = `请输入...`
  comment_to_user_id = 0;
  comment_parent_id = 0;
  should_comment_show = true;

  setTimeout(() => { instance.refs['commentInput'].focus() }, 30) // 需要先让输入框出现再触发focus事件
  current_dynamic_id = v.dynamic_id
}
function choiceClick() { // 点击回复评论
  let v = arguments[0]
  let vv = arguments[1]

  current_dynamic_id = v.dynamic_id

  comment_parent_id = vv.main_comment.comment_id
  comment_to_user_id = vv.main_comment.from_user_id;
  comment_placeholder = `回复${vv.main_comment.name}:`
  should_comment_show = true
  setTimeout(() => { instance.refs['commentInput'].focus() }, 30) // 需要先让输入框出现再触发focus事件
}
function sendComment() { // 发送评论
  let comment_text = comment_text;
  let comment_parent_id = comment_parent_id;
  let comment_from_user_id = store.userInfo.user_id;
  let comment_to_user_id = comment_to_user_id
  let comment_guide_id = current_dynamic_id;
  let module_id = module_id;

  let params = { comment_text, comment_from_user_id, comment_to_user_id, comment_parent_id, comment_guide_id, module_id }
  API.addComment(params).then(res => { // 发评论接口请求
    showToast(res.data.message)
    initData()
    comment_text = ''
    should_comment_show = false
  })
}
function comment_keyup(e) { // 评论输入框的回车键
  if (e.key == "Enter") sendComment()
}
// function contentClike(e) { // 点击页面关闭其他弹出层
//   let excludeClassArr = ['more-ico', 'comment-btn', 'like-btn']
//   if (!excludeClassArr.includes(e.target.className)) { // 通过pointer-events: none;禁用某些点击事件来判断出点击之外的元素
//     dynamicData.forEach((item, index) => { // 关闭其他的dom
//       let dom = instance.refs.moreContent[index]
//       if (item.lc_show) { // 点赞评论在展示且不是当前目标的dom
//         item.lc_show = false
//         anime({ targets: dom, easing: "cubicBezier(.18,.07,.24,.99)", width: "0", duration: 150, });
//       }
//     })
//   }
//   let excludeCommentShowClassArr = ['comment-public', 'btn-send', 'van-field__control', 'comment-btn', 'comment-main', 'comment-minor']
//   if (!excludeCommentShowClassArr.includes(e.target.className)) {
//     should_comment_show = false
//   }
// }

</script>

<style lang="scss" scoped>
@import "@/assets/sass/Dynamic/FriendDynamic.scss";
</style>
