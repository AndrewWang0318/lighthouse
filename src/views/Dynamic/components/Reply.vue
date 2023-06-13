<template>
  <div class="comment-show" v-show="commentData.length > 0">
    <div class="comment-item" v-for="(vv, ii) in commentData" :key="ii">
      <div class="comment-main" @click="commentClick(vv)">
        <span class="main-name">{{ vv.main_comment.name }}</span>
        <span v-if="vv.main_comment.comment_parent">
          <span class="word-reply">回复</span>
          <span class="target-name">{{
            vv.main_comment.comment_parent.user_nickname
          }}</span>
        </span>
        <span class="main-dot">:</span>
        <span class="main-text">{{ vv.main_comment.text }}</span>
      </div>
      <div class="comment-minor">
        <Reply
          v-if="vv.minor_comment.length > 0"
          :commentData="vv.minor_comment"
          :dynamicItem="dynamicItem"
          v-bind="$attrs"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { toRefs, toRef } from 'vue'
export default {
  name: 'Replay',
  props: {
    commentData: { // 评论数据
      type: Object,
      default() {
        return {}
      }
    },
    dynamicItem: {}
  },
  // setup (props) {
  //   props.dynamicItem.value
  //   props.commentData.value

  //   return {}
  // }
}
</script>

<style lang="scss" scoped>
.comment-show {
  font-size: 0.24rem;
  font-weight: bold;

  .comment-item {
    margin-bottom: 0.1rem;
  }

  .comment-main {
    margin-bottom: 0.05rem;

    .target-name,
    .main-name {
      pointer-events: none;
      color: #4b5e84;
    }

    .word-reply {
      pointer-events: none;
    }

    .main-text {
      pointer-events: none;
    }

    .main-dot {
      pointer-events: none;
      margin-right: 0.1rem;
    }
  }

  .comment-minor {
    // padding-left: 0.2rem;
    box-sizing: border-box;
  }
}
</style>
>
