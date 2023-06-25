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
    <!-- 动态展示区 -->
    <div class="dynamic-area" @touchstart="dynamicAreaClick">
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
            <div class="more-ico" more-ico @click="jumpInteract(v, i)">
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
      <div class="dynamic-block" v-if="dynamicDataList.length <= 0">
        <van-empty image="search" description="暂时没有动态哦~快发一条吧" />
      </div>
    </div>
    
    <!-- 评论输入框弹窗 -->
    <div class="comment-public" v-show="should_comment_show">
      <van-field class="comment-input" ref="commentInput" v-model="comment_text" :placeholder="comment_placeholder"
        @keyup="comment_keyup" />
      <div class="btn-send" @click="sendComment">发送</div>
    </div>
    <!-- 浏览图片弹窗 -->
    <van-image-preview v-model:show="img_preview_show" :images="img_preview_arr" :start-position="img_preview_start" />
  </div>
</template>

<script>
export default {
  name: "FriendDynamicPage",
}
</script>

<script setup>
import { getCurrentInstance, ref, reactive, computed } from 'vue';
import { useStore } from '@/stores/stores';
import { useRouter } from "vue-router";
import { showToast } from "vant";
import Reply from '@/views/Dynamic/components/Reply.vue'
import API from "@/request/api";

const router = useRouter();
const store = useStore();
const instance = getCurrentInstance();
const $global = instance.appContext.app.config.globalProperties;
const base_url = $global.base_url;


// 动态数据
let dynamicDataList = ref([]);
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


initData();

function initData() { // 初始化数据
  let parmas = { limit: limit.value, page: page.value };
  API.getDynamicList(parmas).then((res) => {
    if (res.data.code == 0) {
      let dynamicData = res.data.data;
      dynamicDataList.value = dynamicData.map(item => {
        const { dynamic_id, dynamic_user, dynamic_content } = item
        // 媒体文件地址及其信息
        let dynamic_media = item.dynamic_media;
        let dynamic_media_arr = dynamic_media ? dynamic_media.split(",") : [];
        let dynamic_media_data = dynamic_media_arr.map(v => {
          let file_extension = v.slice(v.lastIndexOf(".") + 1).toLowerCase();// 文件后缀名[小写]
          return { url: v, type: $global.tool.checkFileType(file_extension) }
        })
        // 距离当前时间
        let dynamic_time = $global.moment(item.createdAt).fromNow(); 


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

const easing = "cubicBezier(.18,.07,.24,.99)";
const duration = 150;
function jumpInteract(v, idx) { // 点击互动按钮
  // 先关闭之前打开的互动框
  dynamicDataList.value.forEach((v,i) => {
    if(v.lc_show){
      v.lc_show = false;
      $global.anime({ targets: instance.refs.moreContent[i], width: "0",easing, duration });
    } 
  })
  v.lc_show = true;
  // 每次点击都重新打开互动按钮
  let targets = instance.refs.moreContent[idx];
  $global.anime({ targets, width: "0", duration: 0, });
  $global.anime({ targets, width: "3rem", duration: 300, });
}
function dynamicAreaClick(el){ // 动态列表区域点击(用于关闭点赞弹出)
  if(!el.target.attributes['more-ico']){ // 不存在目标元素的属性,则是其他dom
    dynamicDataList.value.forEach((v,i) => {
      if(v.lc_show){
        v.lc_show = false;
        $global.anime({ targets: instance.refs.moreContent[i], width: "0",easing, duration });
      }
    })
    
  }
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
</script>

<style lang="scss" scoped>
@import "@/assets/sass/Dynamic/FriendDynamic.scss";
</style>
