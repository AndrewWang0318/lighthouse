<template>
  <div class="page-home">
    <div class="banner-content">
      <van-swipe class="login-swipe" :autoplay="4000" indicator-color="white" :show-indicators="false">
        <van-swipe-item v-for="(v, i) in swiperList" :key="i">
          <div class="image-item" :style="`background-image:url(${v.imgSrc})`"></div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>
<script setup>
const swiperList = reactive([
  { imgSrc: `${baseUrl}/image/banner/swiper1.jpg` },
  { imgSrc: `${baseUrl}/image/banner/swiper2.png` },
  { imgSrc: `${baseUrl}/image/banner/swiper3.jpg` },
  { imgSrc: `${baseUrl}/image/banner/swiper4.png` },
  { imgSrc: `${baseUrl}/image/banner/swiper5.jpg` },
])
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
}</style>