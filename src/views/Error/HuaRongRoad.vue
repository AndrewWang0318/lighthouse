<template >
  <div class="page-hrd">
    <van-nav-bar
      title=""
      left-text="返回"
      left-arrow
      @click-left="router.go(-1)"
    />
    <div id="game-title">三国华容道</div>
    <div id="game-guild">
      <div class="level-select" @click="showLevePicker = true">
        <span>关卡: </span>
        <span style="color: green;">{{ level_name }}</span>
      </div>
      <div>移动步数: <span style="color: brown;">{{ move_step }}</span></div>
      
      <div class="rank-title">排行榜</div>
    </div>
    <div id="game-content" v-if="!reflash_game" :style="{
      width: wall_w * grid_size + 'rem',
      height: wall_h * grid_size + 'rem',
    }">
      <div id="role-content" :style="{
        width: wall_w * grid_size + 'rem',
        height: wall_h * grid_size + 'rem',
      }">
        <div v-for="v in all_role" :class="`role-item ${v.class_name}`" :style="{
          width: v.width,
          height: v.height,
          position: 'absolute',
          top: `${v.top}rem`,
          left: `${v.left}rem`,
          backgroundImage: `url(${v.img})`,
        }" v-touch:swipe.left="() => { touchMove('l', v) }" v-touch:swipe.right="() => { touchMove('r', v) }"
          v-touch:swipe.top="() => { touchMove('t', v) }" v-touch:swipe.bottom="() => { touchMove('b', v) }">{{
            v.cn_name }}
        </div>
      </div>
      <div id="wall-export" :style="{
        width: export_w * grid_size + 'rem'
      }"></div>
    </div>
    <div id="game-rule">
      <div>规则</div>
    </div>
    <audio hidden ref="walk_audio_el" :src="getUrl('audio/walk.wav')"></audio>


    <van-popup v-model:show="showLevePicker" round position="bottom">
      <van-picker :columns="level_name_columns" @cancel="showLevePicker = false" @confirm="levePickerConfirm" />
    </van-popup>
  </div>
</template>

<script setup>
import all_level_data from "./hrd_level"
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { getUrl } from "@/utils/util"

const router = useRouter();
let reflash_game = ref(false);


const walk_audio_el = ref('');
const level_name_columns = Object.keys(all_level_data).map((key, i) => {
  return { text: all_level_data[key].name, value: i }
})
let level_name = ref(level_name_columns[0].text)
let showLevePicker = ref(false);
const levePickerConfirm = ({ selectedOptions }) => {
  showLevePicker.value = false;
  level_name.value = selectedOptions[0].text;

  gameStart(`level${selectedOptions[0].value + 1}`)
};



const grid_size = 1.5;// 布局一格的长度
const wall_w = 4; // 盒子的宽
const wall_h = 5; // 盒子的高
const export_w = 2; // 出口的宽度

let move_step = ref(0);// 移动步数
let all_role = ref([]) // 所有人物
let all_role_locate = ref([]); // 所有人物坐标点

class Soldier {
  constructor(w, h, lt, img_name, name, cn_name) {
    this.class_name = name;
    this.cn_name = cn_name;
    this.width = `${w * grid_size}rem`;
    this.height = `${h * grid_size}rem`;
    this.top = lt[1] * grid_size;
    this.left = lt[0] * grid_size;
    this.img =  getUrl(`images/hrd/${img_name}`);
    // 出口坐标
    this.export_locate = {
      lb: { x: (wall_w - export_w) / 2, y: wall_h },
      rb: { x: ((wall_w - export_w) / 2) + export_w, y: wall_h }
    }
    // 墙壁坐标
    this.wall_locate = {
      lt: { x: 0, y: 0 },
      rt: { x: wall_w, y: 0 },
      rb: { x: wall_w, y: wall_h },
      lb: { x: 0, y: wall_h }
    }
    // 角色坐标
    this.role_locate = {
      lt: { x: lt[0], y: lt[1] },
      rt: { x: lt[0] + w, y: lt[1] },
      rb: { x: lt[0] + w, y: lt[1] + h },
      lb: { x: lt[0], y: lt[1] + h },
      name: name
    }
  }
  itCanMove(all_locate, move_direct) { // 是否可以移动 move_way移动方式[前进或后退] move_direct移动方向
    // 是否有其他角色阻挡
    let is_block_other = false;
    all_locate.forEach(other_local => {
      let role_close = this.isCloseRole(move_direct, this.role_locate, other_local)
      if (role_close) is_block_other = true;
    })
    // 是否有墙阻挡
    let is_block_wall = this.isCloseWall(move_direct, this.role_locate);
    if (is_block_wall) {
      console.log('有墙壁阻挡');
      return false;
    } else if (is_block_other) {
      console.log('有人阻挡');
      return false;
    } else {
      return true;
    }
  }
  isCloseRole(move_direct, cur_local, tar_local) { // 是否靠近其他角色
    let c_dir, t_dir; // 接触方向 判断方向
    let c_p1, c_p2, t_p1, t_p2;
    if (move_direct == 'l') {
      c_p1 = cur_local.lt
      c_p2 = cur_local.lb
      t_p1 = tar_local.rt
      t_p2 = tar_local.rb

      c_dir = 'x'
      t_dir = 'y'
    }
    if (move_direct == 'r') {
      c_p1 = cur_local.rt
      c_p2 = cur_local.rb
      t_p1 = tar_local.lt
      t_p2 = tar_local.lb

      c_dir = 'x'
      t_dir = 'y'
    }
    if (move_direct == 't') {
      c_p1 = cur_local.lt
      c_p2 = cur_local.rt
      t_p1 = tar_local.lb
      t_p2 = tar_local.rb

      c_dir = 'y'
      t_dir = 'x'
    }
    if (move_direct == 'b') {
      c_p1 = cur_local.lb
      c_p2 = cur_local.rb
      t_p1 = tar_local.lt
      t_p2 = tar_local.rt

      c_dir = 'y'
      t_dir = 'x'
    }
    // 当前角色的起始点或结束点 处于 目标贴合边起始点和结束点之间 则存在阻挡
    let is_inset1 = (c_p1[c_dir] == t_p1[c_dir]) && (c_p1[t_dir] > t_p1[t_dir] && c_p1[t_dir] < t_p2[t_dir])
    let is_inset2 = (c_p2[c_dir] == t_p1[c_dir]) && (c_p2[t_dir] > t_p1[t_dir] && c_p2[t_dir] < t_p2[t_dir])
    let is_inset = is_inset1 || is_inset2
    // 当前角色的起始点或结束点 与 目标贴合边起始点或结束点有重合 则存在阻挡
    let is_close1 = c_p1.x == t_p1.x && c_p1.y == t_p1.y
    let is_close2 = c_p2.x == t_p2.x && c_p2.y == t_p2.y
    let is_close = is_close1 || is_close2

    return is_close || is_inset;
  }
  isCloseWall(move_direct, cur_local) { // 是否靠近墙壁
    let is_close_wall = false
    if (move_direct == 'l') is_close_wall = cur_local.lt.x == this.wall_locate.lt.x;
    if (move_direct == 'r') is_close_wall = cur_local.rt.x == this.wall_locate.rt.x;
    if (move_direct == 't') is_close_wall = cur_local.lt.y == this.wall_locate.lt.y;
    if (move_direct == 'b') is_close_wall = cur_local.rb.y == this.wall_locate.rb.y;
    if (cur_local.name == 'cc' && move_direct == 'b' && cur_local.lb.x == this.export_locate.lb.x && cur_local.rb.x == this.export_locate.rb.x) {
      is_close_wall = false;
    }
    return is_close_wall
  }
  isWin(cc_locate) { // 是否胜利
    return cc_locate.lb.y > this.export_locate.lb.y
  }
  move(move_direct, step = 1) { // 坐标改变
    let distence = 1
    if (move_direct == 'l' || move_direct == 't') {
      distence = -1;
    }
    if (move_direct == 'r' || move_direct == 'b') {
      distence = 1;
    }
    Object.keys(this.role_locate).forEach(key => {
      if (key !== 'name') {
        const item = this.role_locate[key]
        if (move_direct == 'b' || move_direct == 't') {
          item.y += distence
        } else {
          item.x += distence
        }
      }
    })
  }
}
gameStart('level1')

// 游戏开始 [重新换关卡存在响应丢失问题]
function gameStart(level) {
  const all_role_data = all_level_data[level].data.map(item => new Soldier(...item)) // 所有人物
  all_role = ref(all_role_data)
  all_role_locate = ref(all_role_data.map(v => v.role_locate)); // 所有人物坐标点

  move_step.value = 0
  setTimeout(()=>{
    reflash_game.value = true
  },400)
  setTimeout(()=>{
    reflash_game.value = false
  },410)
}

// touchMove事件
function touchMove(move_direct, item) {
  // 如果不能移动则返回
  if (!item.itCanMove(all_role_locate.value, move_direct)) return false;
  // 坐标处理
  item.move(move_direct)
  // 视图处理
  if (move_direct == 'l') item.left -= grid_size;
  if (move_direct == 'r') item.left += grid_size;
  if (move_direct == 't') item.top -= grid_size;
  if (move_direct == 'b') item.top += grid_size;
  move_step.value += 1
  walk_audio_el.value.load()
  walk_audio_el.value.play()
  // 判断是否成功
  const cc_role = (all_role_locate.value.filter((item) => item.name == 'cc'))[0]
  if (item.isWin(cc_role)) {

    setTimeout(() => {
      alert('成功');
    }, 200)
    return false;
  }
}


</script>

<style scoped lang="scss">
.page-hrd {
  min-height: 100vh;
  background-color: rgb(201, 177, 147);
  box-sizing: border-box;
  touch-action: none; // 禁止页面拖动
  background-image: url('../../static/images/hrd/bg.jpg');
  background-size: auto 100%;
  background-position: center center;
  #game-title {
    padding-top: 1rem;
    font-weight: bold;
    font-size: 0.8rem;
    text-align: center;
    margin-bottom: 0.2rem;
    font-family: '楷体';
  }

  #game-guild {
    margin: 0 auto;
    width: 6rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.1rem;
    font-weight: bold;
  }

  #game-content {
    width: 6rem;
    height: 7.5rem;
    background-color: rgb(137, 126, 114);
    border: 0.08rem solid black;
    position: relative;
    margin: 0 auto;
    
    #role-content {
      width: 6rem;
      height: 7.5rem;
      position: absolute;
      z-index: 9;
      top: 0;
      left: 0;
      .cc{
        color: brown !important;
        border-color: brown !important;
        font-size: 0.4rem !important;
      }
      .role-item {
        font-family: '楷体';
        font-size: 0.26rem;
        padding-top: 0.06rem;
        padding-left: 0.06rem;
        font-weight: bold;
        color: rgb(195, 251, 112);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
        transition: all 0.2s;
        border: 0.03rem solid rgb(113, 152, 51);

        box-sizing: border-box;
      }
    }

    #wall-export {
      width: 3rem;
      height: 0.1rem;
      background-color: rgb(137, 126, 114);
      position: absolute;
      left: 50%;

      transform: translateX(-50%);
      bottom: -0.08rem;
      z-index: 2;
    }
  }

  #game-rule{


    position: absolute;
    right: 0.5rem;
    top: 0.4rem;
    // color: #fff;
    font-weight: bold;
  }
  :deep(.van-nav-bar){
    background-color: transparent !important;
  }
}
</style>