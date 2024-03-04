<template>
  <div class="page-home">
    <div class="banner-content">
      <van-swipe class="login-swipe" :autoplay="4000" indicator-color="white" :show-indicators="false">
        <van-swipe-item v-for="(v, i) in swiperList" :key="i">
          <div class="image-item" :style="`background-image:url(${v.imgSrc})`"></div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="earch-content">
      <div id="earth"></div>
      <div id="popup"></div>
    </div>
    <van-dialog v-model:show="show" :title="user_name" show-cancel-button>
      <div>{{ user_content }}</div>
    </van-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";



const instance = getCurrentInstance();
const $global = instance.appContext.app.config.globalProperties;
const base_url = $global.base_url;
const swiperList = reactive([
  { imgSrc: `${base_url}/image/banner/swiper1.jpg` },
  { imgSrc: `${base_url}/image/banner/swiper2.png` },
  { imgSrc: `${base_url}/image/banner/swiper3.jpg` },
  { imgSrc: `${base_url}/image/banner/swiper4.png` },
  { imgSrc: `${base_url}/image/banner/swiper5.jpg` },
])
const show = ref(false);
const user_content = ref("");
const user_name = ref("");


onMounted(() => {

  const color_arr = [
    "#f42e695",
    "#184e68",
    "#5B247A",
    "#7117ea",
    "#622774",
    "#f47920",
    "#f47920",
    "#ef5b9c",
    "#f15b6c",
    "#6950a1",
    "#1d953f",
  ];
  const name_arr = [
    "长风骑士",
    "酸菜鱼",
    "不要熬夜",
    "吕田心",
    "活力雪碧",
    "无所谓了",
    "以后",
    "芝士雪豹",
    "哇咔咔",
    "城南花已开",
    "豆本豆",
  ];
  // 场景
  const scene = new THREE.Scene();

  // 镜头
  const camera = new THREE.PerspectiveCamera(
    32,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 3000;

  // 渲染器
  const renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, 400);
  document.getElementById("earth").appendChild(renderer.domElement);

  //坐标初始化
  const vector = new THREE.Vector3(); //三维坐标
  const spherical = new THREE.Spherical(); //球坐标

  //轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true; //为true时，相机自动围绕目标旋转,但必须在animation循环中调用update()

  var objects = []; //存放转化为3D的照片对象
  var spheres = []; //用来存放目标对象的位置

  init(); //初始化并形成球体照片墙
  animate(); //每隔一段时间渲染

  function getRandomNumber(min, max) {
    const random = Math.random() * (max - min + 1) + min;
    const randomNumber = Math.floor(random);
    return randomNumber;
  }
  function init() {
    //放图片
    for (i = 1; i < 50; i++) {
      let num = getRandomNumber(0, color_arr.length - 1);
      var element = document.createElement("div");
      element.className = "element"; //给图片加类名即设置对应的图片大小

      element.innerHTML = name_arr[num];
      element.name = name_arr[num]; // 给元素的name属性赋值，以便获取鼠标点击的当前值

      let block = document.createElement("div");
      block.className = "block"; //给图片加类名即设置对应的图片大小
      block.style.backgroundColor = color_arr[num]; //保持图像的宽高比例，将图片缩放到正好完全覆盖定义的背景区域

      element.append(block);

      var object = new CSS3DObject(element); //可以将HTML元素作为纹理添加到3D对象中，从而创建有趣的3D特效
      scene.add(object);
      objects.push(object); //为了知道被添加到照片元素的个数
    }
    var l = objects.length;

    // 根据球形排列公式计算每个元素的位置
    for (var i = 0; i <= l; i++) {
      //该部分为固定的数学公式
      var phi = Math.acos(-1 + (2 * i) / l);
      var theta = Math.sqrt(l * Math.PI) * phi;
      // 计算元素在球面上的坐标
      var x = 750 * Math.cos(theta) * Math.sin(phi); //750代表球的半径
      var y = 750 * Math.sin(theta) * Math.sin(phi);
      var z = 750 * Math.cos(phi);

      var object = new THREE.Object3D();
      object.position.set(x, y, z); //设置对象的位置

      vector.copy(object.position).multiplyScalar(2); //将该向量与所传入的标量2进行相乘。
      object.lookAt(vector); //vector这个变量的作用，它用来作为'目标位置'，使用这个方法让这个位置的对象object看向vector这一点所在的方向
      spheres.push(object);
    }
    transform(spheres, 3600); //动画转换
  }

  function transform(spheres, duration) {
    for (var i = 0; i < objects.length; i++) {
      var object = objects[i];
      var target = spheres[i];
      //过渡图片移动的位置
      new TWEEN.Tween(object.position)
        .to(
          { x: target.position.x, y: target.position.y, z: target.position.z },
          Math.random() * duration + duration
        ) //改变当前模型的位置
        .easing(TWEEN.Easing.Exponential.InOut) //运动曲线
        .start(); //开启动画

      new TWEEN.Tween(object.rotation) //过渡图片旋转
        .to(
          { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }
  }
  function animate() {
    TWEEN.update();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // 监听鼠标单击事件
  window.addEventListener("mousedown", clickMouse);

  // 鼠标单击事件
  function clickMouse(e) {
    let tname = e.target.name; //获取点击图片的名称

    if(!tname) return;

    console.log(tname);
    show.value = true
    user_name.value = tname
    user_content.value = "这是一段测试用的话！！！"
  }



})





</script>
<style lang="scss">
.page-home {
  .banner-content {
    background-color: #2e2e2e;
    padding: 0.04rem;
    box-sizing: border-box;
    // width: 6rem;
    height: 2rem;

    .my-swipe .van-swipe-item {
      color: #fff;
      font-size: 20px;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      background-color: #fff;
    }

    .login-content,
    .register-content {
      background-color: white;
      padding: 0.2rem 0.1rem;
    }

    .image-item {
      height: 2rem;
      background-position: center center;
      background-size: cover;
    }
  }

  .earch-content {
    background-color: #2e2e2e;
  }

  .element {
    cursor: pointer;
    width: 100px;
    height: 100px;
    text-align: center;
    /* line-height: 100px; */
    font-size: 20px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .block {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .element:hover {
    text-shadow: 0px 2px 10px rgba(0, 255, 255);
  }
}
</style>