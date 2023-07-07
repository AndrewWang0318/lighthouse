<template>
  <div class="comment-item" v-show="comment_data.length > 0" v-for="(vv, i) in comment_data">
    <div class="comment-main" @click="commentClick(vv)">
      <span class="main-name">{{ vv.comment_user.user_nickname }}</span>
      <span v-if="vv.comment_to_user">
        <span class="word-reply">回复</span>
        <span class="target-name">{{
          vv.comment_to_user.user_nickname
        }}</span>
      </span>
      <span class="main-dot">:</span>
      <span class="main-text">{{ vv.comment_content }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Replay'
}
</script>
<script setup>
const props = defineProps({
  comment_data:{
    type: Object,
    default:()=> []
  }
})
const emits = defineEmits(["transfer_data"])

function commentClick(vv){
  emits("transfer_data",vv)
}
</script>

<style lang="scss" scoped>
.comment-item {
  font-size: 0.24rem;
  font-weight: bold;
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
</style>
>
