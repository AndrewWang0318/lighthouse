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
            top:v.top,
            left:v.left,
            position: 'absolute',
            backgroundImage: `url( ${ getImage(`../../assets/images/hrd/${v.img}`) } )`,
            border: '0.02rem solid gray',
            boxSizing:'border-box',
          }"
        >{{ v.cn_name }}</div>
      </div>
      <div id="export"></div>
    </div>
  </div>
</template>

<script setup>
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
    this.top = lt[1] * grid_size + 'rem';
    this.left = lt[0] * grid_size + 'rem';
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
  itCanMove(all_locate,move_way,move_direct) { // 是否可以移动 move_way移动方式[前进或后退] move_direct移动方向
    let is_close_wall = false;
    let is_close_other = false;
    if(move_way == "h"){ // h横向
      if(move_direct){ // 向右走
        // 是否有墙壁阻挡
        if(this.role_locate.rt.x == this.wall_locate.rt.x){
          is_close_wall = true;
        }
        // 是否有角色阻挡
        all_locate.forEach( other_local => {
          if( this.role_locate.rt.x == other_local.rt.x &&  (this.role_locate.rt.y <= other_local.rt.y &&  this.role_locate.rb.y >= other_local.rb.y)  ){
            is_close_other = true;
          }
        })
      }else{ // 想左走
        // 是否有墙壁阻挡
        if(this.role_locate.lt.x == this.wall_locate.lt.x){
          is_close_wall = true;
        }
        // 是否有角色阻挡
        all_locate.forEach( other_local => {
          if( this.role_locate.lt.x == other_local.lt.x &&  (this.role_locate.lt.y <= other_local.lt.y &&  this.role_locate.rb.y >= other_local.rb.y)  ){
            is_close_other = true;
          }
        })
      }
      
    }
    if(move_way == "v"){ // v竖向
      if(move_direct){ // 向上走
        // 是否有墙壁阻挡
        if(this.role_locate.lt.y == this.wall_locate.lt.y){
          is_close_wall = true;
        }
        // 是否有角色阻挡
        all_locate.forEach( other_local => {
          if(other_local.name !== this.role_locate.name && this.role_locate.lt.y == other_local.lt.y &&  (this.role_locate.lt.x >= other_local.lt.x &&  this.role_locate.rt.x <= other_local.rt.x)  ){
            is_close_other = true;
          }
        })
      }else{ // 向下走
        // 是否有墙壁阻挡
        if(this.role_locate.lb.y == this.wall_locate.lb.y){
          is_close_wall = true;
        }
        // 是否是曹操且在出口处
        if(this.role_locate.name == "cc" && (this.role_locate.lb.x >= this.export_locate.lb.x &&  this.role_locate.rb.x <=  this.export_locate.rb.x)){
          is_close_wall = false;
        }
        // 是否有角色阻挡
        all_locate.forEach( other_local => {
          if(other_local.name !== this.role_locate.name && this.role_locate.lb.y == other_local.lb.y &&  (this.role_locate.lb.x >= other_local.lb.x && this.role_locate.rb.x <= other_local.rb.x)  ){
            // console.log(other_local,this.role_locate.lb.y +'=='+ other_local.lb.y +'&&'+  (this.role_locate.lb.x +'>='+ other_local.lb.x +'&&'+this.role_locate.rb.x +'<='+ other_local.rb.x))
            is_close_other = true;
          }
          
        })
      }
    }

    if(is_close_wall){
      console.log('有墙壁阻挡');
      return false;
    }else if(is_close_other){
      console.log('有人阻挡');
      return false;
    }else{
      return true;
    }
  }
  isWin(cc_locate){ // 是否胜利
    return cc_locate.lb.y > this.export_locate.lb.y
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

let all_role = [ cc,gy,zf,zy,mc,hz,xb1,xb2,xb3,xb4 ]; // 所有人物
let all_role_locate = all_role.map( v => v.role_locate ); // 所有人物坐标点


function getImage(url){
  return new URL(url, import.meta.url).href
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