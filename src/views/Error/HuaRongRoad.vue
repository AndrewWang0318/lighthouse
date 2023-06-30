<template >
  <div class="page-hrd">
    <div id="game-title">华容道</div>
    <div id="game-content">
      <div id="role-content">
        <div 
          v-for="v in all_role"
          :class="`role-item ${v.name}`"
          :style="{
            width:v.width,
            height:v.height,
            top:`${v.top}rem`,
            left:`${v.left}rem`,
            position: 'absolute',
            backgroundImage: `url( ${ getImage(`./images/hrd/${v.img}`) } )`,
            border: '0.02rem solid gray',
            boxSizing:'border-box',
          }"
          v-touch:swipe.left="()=>{swipeHandler('l',v)}"
          v-touch:swipe.right="()=>{swipeHandler('r',v)}"
          v-touch:swipe.top="()=>{swipeHandler('t',v)}"
          v-touch:swipe.bottom="()=>{swipeHandler('b',v)}"
        >{{ v.cn_name }}</div>
      </div>
      <div id="export"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const grid_size = 1.5;// 布局一格的长度
const wall_w = 4; // 盒子的宽
const wall_h = 5; // 盒子的高
const export_w = 2; // 出口的宽度
class Soldier {
  constructor(w,h,lt,img_name,name,cn_name) {
    this.class_name = name;
    this.cn_name = cn_name;
    this.width = `${w * grid_size}rem`;
    this.height = `${h * grid_size}rem`;
    this.top = lt[1] * grid_size;
    this.left = lt[0] * grid_size;
    this.img = img_name;

    // 出口坐标
    this.export_locate = {
      rb:{ x:(wall_w - export_w) / 2,y:wall_h },
      lb:{ x:((wall_w - export_w) / 2 ) + export_w,y:wall_h }
    }
    // 墙壁坐标
    this.wall_locate = {
      lt:{x:0,y:0},
      rt:{x:wall_w,y:0},
      rb:{x:wall_w,y:wall_h},
      lb:{x:0,y:wall_h}
    }
    // 角色坐标
    this.role_locate = {
      lt:{ x:lt[0],y:lt[1] },
      rt:{ x:lt[0]+w,y:lt[1] },
      rb:{ x:lt[0]+w,y:lt[1] + h },
      lb:{ x:lt[0],y:lt[1] + h },
      name:name
    }
  }
  itCanMove(all_locate,move_direct) { // 是否可以移动 move_way移动方式[前进或后退] move_direct移动方向
    let dir = ''
    let start_opint = ''
    let end_opint = ''
    if(move_direct == 'l'){
      dir = 'x'
      start_opint = 'lt'
      end_opint = 'lb'
    }
    if(move_direct == 'r'){
      dir = 'x'
      start_opint = 'rt'
      end_opint = 'rb'
    }
    if(move_direct == 't'){
      dir = 'y'
      start_opint = 'lt'
      end_opint = 'rt'
    }
    if(move_direct == 'b'){
      dir = 'y'
      start_opint = 'lb'
      end_opint = 'rb'
    }

    

    let is_block_wall = false; // 是否有墙阻挡
    let is_block_other = false; // 是否有其他角色阻挡

    let wall_start_point_close = this.isClose(this.role_locate[start_opint],this.wall_locate[start_opint],this.wall_locate[end_opint])
    let wall_end_point_close = this.isClose(this.role_locate[end_opint],this.wall_locate[start_opint],this.wall_locate[end_opint])
    if(!wall_start_point_close && !wall_end_point_close) is_block_wall = true;
    // 如果是曹操在出口则不算墙阻挡
    if(this.name == 'cc'&& move_direct == 'b' && this.role_locate.lb.x == this.export_locate.lb.x && this.role_locate.rb.x == this.export_locate.rb.x){
      is_block_wall = false;
    }
    all_locate.forEach( other_local => {
      // 如果当前角色的 (左上点的y >= .左上点的y && 左上点的y < 坐下点y) && 左上点的x == .右上点的x
      // 判断两点坐标 在目标两点之中
      let role_start_point_close = this.isClose(this.role_locate[start_opint],other_local[start_opint],other_local[end_opint])
      let role_end_point_close = this.isClose(this.role_locate[end_opint],other_local[start_opint],other_local[end_opint])
      if(role_start_point_close && role_end_point_close) is_block_other = true;
    })
    if(is_block_wall){
      console.log('有墙壁阻挡');
      return false;
    }else if(is_block_other){
      console.log('有人阻挡');
      return false;
    }else{
      return true;
    }
  }
  isClose(currPoint,point1,point2){
    let x_pass = Math.abs(point1.x) <= Math.abs(currPoint.x) <= Math.abs(point2.x);
    let y_pass = Math.abs(point1.y) <= Math.abs(currPoint.y) <= Math.abs(point2.y);

    return x_pass && y_pass
  }
  isWin(cc_locate){ // 是否胜利
    return cc_locate.lb.y > this.export_locate.lb.y
  }

  move(move_direct,step = 1){ // 坐标改变
    let dir = 'x';
    let distence = 1
    if(move_direct == 'l'){
      dir = 'x';
      distence = -1;
    }
    if(move_direct == 'r'){
      dir = 'x';
      distence = 1;
    }
    if(move_direct == 't'){
      dir = 'y';
      distence = -1;
    }
    if(move_direct == 'b'){
      dir = 'y';
      distence = 1;
    }
    Object.keys(this.role_locate).forEach( key => {
      this.role_locate[key][dir] += distence
      console.log(this.role_locate[key][dir])
    })
  }
}
let cc = new Soldier(2,2,[1,0],'cc.png','cc','曹操');
let hz = new Soldier(1,2,[0,0],'hz.png','hz','黄忠');
let mc = new Soldier(1,2,[3,0],'mc.png','mc','马超');
let zf = new Soldier(1,2,[0,2],'zf.png','zf','张飞');
let gy = new Soldier(2,1,[1,2],'gy.png','gy','关羽');
let zy = new Soldier(1,2,[3,2],'zy.png','zy','赵云');



let xb1 = new Soldier(1,1,[0,4],'xb.png','xb1','士');
let xb2 = new Soldier(1,1,[1,3],'xb.png','xb2','士');
let xb3 = new Soldier(1,1,[2,3],'xb.png','xb3','士');
let xb4 = new Soldier(1,1,[3,4],'xb.png','xb4','士');

let all_role = ref([ cc,gy,zf,zy,mc,hz,xb1,xb2,xb3,xb4 ]); // 所有人物

let __all_role_locate = all_role.value.map( v => v.role_locate ); // 所有人物坐标点

let all_role_locate = ref(__all_role_locate)

function getImage(url){
  return new URL(url, import.meta.url).href
}

function swipeHandler(move_direct,item){
  if(item.name == 'cc'){
    if(item.isWin(item.role_locate)){
      alert('成功')
    }
  }
  if(item.itCanMove(all_role_locate.value,move_direct)){
    if(move_direct == 'l'){
      item.left -= grid_size
    }
    if(move_direct == 'r'){
      item.left += grid_size
    }
    if(move_direct == 't'){
      item.top -= grid_size
    }
    if(move_direct == 'b'){
      item.top += grid_size
    }

    item.move(move_direct)
  }else{
    return false
  }
}
</script>

<style scoped lang="scss">
.page-hrd {
  min-height: 100vh;
  background-color: rgb(201, 177, 147);
  padding-top: 1rem;
  box-sizing: border-box;
  .role-item {
    font-family: '楷体';
    font-size: 0.26rem;
    line-height: 0.36rem;
    text-indent: 0.1rem;
    font-weight: bold;
    color: goldenrod;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .cc {
    color: brown;
  }

  #game-title {
    font-weight: bold;
    font-size: 0.8rem;
    text-align: center;
    margin-bottom: 0.2rem;
    font-family: '楷体';
  }

  #game-content {
    width: 6rem;
    height: 7.5rem;
    background-color: rgba(0, 0, 0, 0.7);
    border: 0.1rem solid rgb(0, 0, 0);
    position: relative;
    margin: 0 auto;
  }

  #role-content {
    width: 6rem;
    height: 7.5rem;
    position: absolute;
    top: 0;
    left: 0;
  }

  #export {
    width: 3rem;
    height: 1.5rem;
    background-color: rgb(201, 177, 147);
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(1.5rem);
    bottom: 0;
    z-index: 2;
  }
}</style>