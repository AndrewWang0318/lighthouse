<template>
  <div class="Error">
    <canvas ref="drop_code" ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
  let drop_code = ref();
  onMounted(() => {
    let drop_code_dom = drop_code.value;
    let win_width = window.innerWidth;
    let win_height = window.innerHeight;
    let drop_code_canvas = drop_code_dom.getContext("2d");
    let font_size = 12;
    let font_num = (win_width / font_size) | 0;
    let arrIndex = []; // 保存y坐标数组
    drop_code_dom.width = win_width;
    drop_code_dom.height = win_height;
    for (let i = 0; i < font_num; i++) {
      arrIndex[i] = 1;
    }
    function hua() {
      drop_code_canvas.fillStyle = "rgba(0,0,0,0.15)";
      drop_code_canvas.fillRect(0, 0, win_width, win_height);
      for (let i = 0; i < font_num; i++) {
        let str = ((Math.random() * 36) | 0).toString(36)[Math.random() > 0.5 ? "toLocaleLowerCase" : "toLocaleUpperCase"]();
        drop_code_canvas.font = `${font_size}px 黑体 bold`;
        drop_code_canvas.fillStyle = "#0c3";
        drop_code_canvas.fillText(
          str,
          font_size * i,
          arrIndex[i]++ * font_size
        ); //文字坐标
        if (arrIndex[i] * font_size > win_height && Math.random() > 0.95) {
          arrIndex[i] = 0;
        }
      }
    }
    setInterval(hua, 35);
  });
</script>