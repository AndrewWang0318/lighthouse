<template>
  <div class="friend-dynamic" @click="contentClike">
    <div class="dynamic-area">
      <div class="dynamic-item" v-for="(v, i) in dynamicData" :key="i">
        <div class="dynamic-header">
          <div class="user-avatar" :style="`background-image:url('http://${v.user_avatar}')`"></div>
          <div class="dynamic-info">
            <div class="user-nickname">{{ v.user_nickname }}</div>
            <div class="dynamic-title">{{ v.dynamic_title }}</div>
          </div>
        </div>
        <div class="dynamic-show">
          <div class="dynamic-show-item" v-for="(item, index) in v.dynamic_show" :key="index"
            :style="`background-image:url('http://${item.url}')`" @click="media_preview(v.dynamic_show, index)" />
        </div>
        <div class="dynamic-function">
          <div class="dynamic-time">{{ v.dynamic_time }}</div>
          <div class="dynamic-more">
            <div class="more-ico" @click="jumpInteract(i)">
              <div class="ico"> <van-icon name="ellipsis" /> </div>
            </div>
            <div class="more-content" ref="moreContent">
              <div class="like-btn" @click="addLike(v, i)">
                <van-icon name="like-o" style="pointer-events: none;" />
                <div class="text" style="pointer-events: none;">{{ v.is_liked ? '取消' : '赞' }}</div>
              </div>
              <div class="separate" />
              <div class="comment-btn" @click="addComment(v, i)">
                <van-icon name="comment-o" style="pointer-events: none;" />
                <div style="pointer-events: none;" class="text">评论</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dynamic-feedback">
          <div class="like-show" v-show="v.liked_user.length > 0">
            <van-icon class="like-ico" name="like-o" />
            <div class="like-user">{{ v.liked_user.join(",") }}</div>
          </div>
          <Reply :dynamicItem="v" :commentData="v.comment_content" @transfer_data="choiceClick" />
        </div>
      </div>
    </div>


    <!-- 发动态按钮 -->
    <div class="btn-upload-dynamic" ref="btn_upload" @click="uploadDynamic" @touchmove="uploadBtnMove">
      <van-icon name="plus" size='0.4rem' color="#ffffff" />
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
import _API from "@/request/api";
import { Toast } from "vant";
import Reply from '@/views/Dynamic/components/Reply.vue'
import { ref, reactive ,onMounted} from 'vue';
import { store } from '@/stores/stores'
export default {
  name: "FriendDynamic",
  components: {
    Reply
  },
  setup () {
    const _store = store();
    console.log()
    let dynamicData = reactive([]); // 动态数据
    let currentIndex = ref(null); // 当前点击的某一项

    let comment_text = ref(null);
    let comment_placeholder = ref('请输入...');
    let should_comment_show = ref(false);
    let comment_focus = ref(false);
    let current_dynamic_id = ref(null);
    let comment_to_user_id = ref(0); // 评论的用户的id
    let comment_parent_id = ref(0); // 评论的父级id
    let module_id = ref(4);


    let img_preview_show = ref(false); // 大图显示
    let img_preview_arr = reactive([]);
    let img_preview_start = ref(0);

    let userInfo = reactive(_store.userInfo); //用户信息
    let page = ref(1);
    let limit = ref(10);
































    

    return {
      dynamicData,
      currentIndex,
      comment_text,
      comment_placeholder,
      should_comment_show,
      comment_focus,
      current_dynamic_id,
      comment_to_user_id,
      comment_parent_id,
      module_id,
      img_preview_show,
      img_preview_arr,
      img_preview_start,
      userInfo,
      page,
      limit
    }
  },


  data() {
    return {
      dynamicData: [], // 动态数据
      currentIndex: null, // 当前点击的某一项

      comment_text: null,
      comment_placeholder: '请输入...',
      should_comment_show: false,
      comment_focus: false,
      current_dynamic_id: null,
      comment_to_user_id: 0, // 评论的用户的id
      comment_parent_id: 0, // 评论的父级id
      module_id: 4,


      img_preview_show: false, // 大图显示
      img_preview_arr: [],
      img_preview_start: 0,

      userInfo: '', //用户信息
      page: 1,
      limit: 10,
    };
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() { // 初始化数据
      let limit = this.limit
      let page = this.page
      let parmas = { limit, page };
      _API.dynamicList(parmas).then((res) => {
        let dynamicList = res.data.success; // 所有动态的数据
        let dynamicData = []
        dynamicList.forEach(element => {
          // 当前动态id
          let dynamic_id = element.dynamic_id
          // 媒体文件地址及其信息
          let dynamic_show = []
          if (element.dynamic_media_url) {
            let dynamic_media = element.dynamic_media_url.split(",")
            dynamic_media.forEach(item => {
              let file_extension = item.slice(item.lastIndexOf(".") + 1).toLowerCase();// 文件后缀名[小写]
              let file_type = checkFileType(file_extension); // 通过文件类型获取文件路径的子路径
              let obj = { url: item, type: file_type }
              dynamic_show.push(obj)
            })
          }
          //点赞数据
          let dynamic_like = element.dynamic_like
          let liked_user = [] // 点赞人名文本
          let is_liked = false; // 是否已经点过赞
          dynamic_like.forEach(item => {
            if (this.userInfo.user_id == item.like_user.user_id) is_liked = true // 本人id出现过点赞列表中
            liked_user.push(item.like_user.user_nickname)
          })
          // 距离当前时间
          let dynamic_time = this.$moment(element.createdAt).fromNow();
          // 评论的数据
          let comment_content = []
          // 回复的数据
          let reply_content = []
          element.dynamic_comment.forEach((item) => {
            if (item.comment_parent_id == 0) {
              comment_content.push({
                main_comment: {
                  comment_id: item.comment_id,
                  comment_parent: item.comment_parent,
                  comment_parent_id: item.comment_parent_id,
                  comment_user: item.comment_user,
                  from_user_id: item.comment_user.user_id,
                  to_user_id: item.comment_to_user_id,
                  name: item.comment_user.user_nickname,
                  text: item.comment_text,
                },
                minor_comment: []
              })
            } else {
              reply_content.push({
                main_comment: {
                  comment_id: item.comment_id,
                  comment_parent: item.comment_parent,
                  comment_parent_id: item.comment_parent_id,
                  comment_user: item.comment_user,
                  from_user_id: item.comment_user.user_id,
                  to_user_id: item.comment_to_user_id,
                  name: item.comment_user.user_nickname,
                  text: item.comment_text,
                },
                minor_comment: []
              })
            }
          })
          dealReply(comment_content, reply_content)
          function dealReply(comment_content, reply_content) { // 递归展示
            if (reply_content.length <= 0) return;
            comment_content.forEach(v => { // 第一层
              reply_content.forEach((vv, ii) => { // 所有的回复
                let comment_parent_id = vv.main_comment.comment_parent_id
                let comment_id = v.main_comment.comment_id
                if (comment_parent_id == comment_id) {
                  v.minor_comment.push(vv)
                  reply_content.splice(ii, 1)
                }
              })
              dealReply(v.minor_comment, reply_content)
            })

          }

          dynamicData.push({
            lc_show: false,
            is_liked, dynamic_id,
            user_avatar: element.dynamic_user.user_avatar,
            user_nickname: element.dynamic_user.user_nickname,
            dynamic_title: element.dynamic_text,
            dynamic_show,
            dynamic_time,
            liked_user,
            dynamic_like,
            comment_content,
          })
        });

        this.dynamicData = dynamicData
      });
    },
    jumpInteract(i) {// 点赞及评论显示
      this.currentIndex = i;
      this.dynamicData.forEach((item, index) => { // 关闭其他的dom
        let dom = this.$refs.moreContent[index]
        if (item.lc_show && index !== i) { // 点赞评论在展示且不是当前目标的dom
          item.lc_show = false
          this.$anime({ targets: dom, easing: "cubicBezier(.18,.07,.24,.99)", width: "0", duration: 150, });
        }
      })
      this.dynamicData[i].lc_show = !this.dynamicData[i].lc_show;
      let element = this.$refs.moreContent[i];
      if (this.dynamicData[i].lc_show) {
        this.$anime({ targets: element, width: "3rem", duration: 300, });
      } else {
        this.$anime({ targets: element, easing: "cubicBezier(.18,.07,.24,.99)", width: "0", duration: 150, });
      }
    },
    addLike(v, i) { // 点击赞
      let user_id = this.userInfo.user_id
      let like_guide_id = v.dynamic_id
      let module_id = 4
      if (v.is_liked) {// 取消赞
        let like_id = null;
        v.dynamic_like.forEach(item => {
          if (user_id == item.like_user.user_id) like_id = item.like_id
        })
        let parmas = { like_id, user_id };
        _API.cancelLike(parmas).then(res => {
          if (res.data.status !== 200) Toast(res.data.message)
          this.initData()
        })
      } else { // 点赞
        let parmas = { like_guide_id, module_id, user_id }
        _API.addLike(parmas).then(res => {
          if (res.data.status !== 200) Toast(res.data.message)
          this.initData()
        })
      }
      this.jumpInteract(i)
    },
    addComment(v, i) { // 点击评论
      this.jumpInteract(i)
      this.comment_placeholder = `请输入...`
      this.comment_to_user_id = 0;
      this.comment_parent_id = 0;
      this.should_comment_show = true;

      setTimeout(() => { this.$refs['commentInput'].focus() }, 30) // 需要先让输入框出现再触发focus事件
      this.current_dynamic_id = v.dynamic_id
    },
    choiceClick() { // 点击回复评论
      let v = arguments[0]
      let vv = arguments[1]

      this.current_dynamic_id = v.dynamic_id

      this.comment_parent_id = vv.main_comment.comment_id
      this.comment_to_user_id = vv.main_comment.from_user_id;
      this.comment_placeholder = `回复${vv.main_comment.name}:`
      this.should_comment_show = true
      setTimeout(() => { this.$refs['commentInput'].focus() }, 30) // 需要先让输入框出现再触发focus事件
    },
    sendComment() { // 发送评论
      let comment_text = this.comment_text;
      let comment_parent_id = this.comment_parent_id;
      let comment_from_user_id = this.userInfo.user_id;
      let comment_to_user_id = this.comment_to_user_id
      let comment_guide_id = this.current_dynamic_id;
      let module_id = this.module_id;

      let params = { comment_text, comment_from_user_id, comment_to_user_id, comment_parent_id, comment_guide_id, module_id }
      _API.addComment(params).then(res => { // 发评论接口请求
        Toast(res.data.message)
        this.initData()
        this.comment_text = ''
        this.should_comment_show = false
      })
    },
    comment_keyup(e) { // 评论输入框的回车键
      if (e.key == "Enter") this.sendComment()
    },
    contentClike(e) { // 点击页面关闭其他弹出层
      let excludeClassArr = ['more-ico', 'comment-btn', 'like-btn']
      if (!excludeClassArr.includes(e.target.className)) { // 通过pointer-events: none;禁用某些点击事件来判断出点击之外的元素
        this.dynamicData.forEach((item, index) => { // 关闭其他的dom
          let dom = this.$refs.moreContent[index]
          if (item.lc_show) { // 点赞评论在展示且不是当前目标的dom
            item.lc_show = false
            this.$anime({ targets: dom, easing: "cubicBezier(.18,.07,.24,.99)", width: "0", duration: 150, });
          }
        })
      }
      let excludeCommentShowClassArr = ['comment-public', 'btn-send', 'van-field__control', 'comment-btn', 'comment-main', 'comment-minor']
      if (!excludeCommentShowClassArr.includes(e.target.className)) {
        this.should_comment_show = false
      }
    },
    media_preview(v, i) { // 预览图大图展示
      let arr = []
      v.forEach(item => {
        arr.push(`http://${item.url}`)
      })
      this.img_preview_arr = arr
      this.img_preview_start = i
      this.img_preview_show = true
    },
    uploadDynamic() { // 跳转到写动态
      this.$router.push('/dynamicUpload')
    },
    uploadBtnMove(event) { // 评论按钮可拖拽
      let client_width = document.body.clientWidth
      let client_height = document.body.clientHeight
      const design_width = 750; // 设计图宽度
      let scal = client_width / design_width // 缩放倍数
      let dom = this.$refs.btn_upload
      let dom_half_width = (dom.offsetWidth / 2)
      let dom_half_height = (dom.offsetHeight / 2)
      let x = event.targetTouches[0].pageX
      let y = event.targetTouches[0].pageY

      let topSpace = 88 * scal
      let bottomSpace = 112 * scal


      if (y - dom_half_height - topSpace <= 0) y = dom_half_height + topSpace
      if (x - dom_half_width <= 0) x = dom_half_width

      if (x + dom_half_width >= client_width) x = client_width - dom_half_width
      if (y + dom_half_width >= client_height - bottomSpace) y = client_height - bottomSpace - dom_half_width

      dom.style.left = x - dom_half_width + "px"
      dom.style.top = y - dom_half_height + "px"
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/Dynamic/FriendDynamic.scss";
</style>
