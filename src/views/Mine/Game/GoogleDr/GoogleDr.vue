<template>
  <div class="page-googledr">

  </div>
</template>

<script setup>
  const DEFAULT_WIDTH = 600;// 游戏默认宽度
  const FPS = 60; // 每秒帧数
  const IS_HIDPI = window.devicePixelRatio > 1; // 像素大小的比率，标准显示器HiDPI
  const IS_IOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);  // IOS系统
  const IS_Android = /Android/.test(window.navigator.userAgent);// 安卓系统
  const IS_MOBILE = IS_Android || IS_IOS;// 移动端
  const IS_TOUCH_ENABLED = 'ontouchstart' in window;// 判断是否支持touch事件
  // Runner类
  class Runner {

  }
  // 默认游戏配置
  Runner.config = {
    ACCELERATION: 0.001,    //加速度
    BG_CLOUD_SPEED: 0.2,    //背景云速度
    BOTTOM_PAD: 10,         //底部
    CLEAR_TIME: 3000,       //清空时间
    CLOUD_FREQUENCY: 0.5,   //云频率
    GAMEOVER_CLEAR_TIME: 750,//游戏结束清空时间
    GAP_COEFFICIENT: 0.6,   //隙缝系数
    GRAVITY: 0.6,           //仿重力系数
    INITIAL_JUMP_VELOCITY: 12,//初始跳跃速度
    INVERT_FADE_DURATION: 12000,//反转淡入持续时间
    INVERT_DISTANCE: 700,   //反转距离
    MAX_BLINK_COUNT: 3,     //最大BLINK数
    MAX_CLOUDS: 6,          //最大云数
    MAX_OBSTACLE_LENGTH: 3, //最大障碍物长度
    MAX_OBSTACLE_DUPLICATION: 2,//最大障碍物重复
    MAX_SPEED: 13,          //最高速度
    MIN_JUMP_HEIGHT: 35,    //最高跳跃高度
    MOBILE_SPEED_COEFFICIENT: 1.2,//移动端速度系数
    RESOURCE_TEMPLATE_ID: 'audio-resources',
    SPEED: 6,               //速度
    SPEED_DROP_COEFFICIENT: 3   //速度下降系数
  };
  // 默认尺寸
  Runner.defaultDimensions = {
    WIDTH: DEFAULT_WIDTH,
    HEIGHT: 150
  };

</script>

<style lang="scss" scoped>

</style>