<template>
  <div class="page-selection">
    <div class="data-show">
      <div class="item-show" v-for="(v, i) in selectedRows" :key="i = 'selectedRows'">
        {{ v }}
      </div>
    </div>
    <div class="data-table" @mousemove="handleMouseMove" @mouseup="handleMouseUp">
      <div v-if="isSelecting" class="drag-select" :style="dragSelectStyle"></div>
      <div class="table" @mousedown="handleMouseDown">
        <div class="table-row" v-for="(rowItem, rowIndex) in data" :key="rowIndex">
          <div v-for="(cellItem, cellIndex) in rowItem" :key="`cellIndex${cellIndex}`"
            :class="`table-cell ${isSelected(rowIndex + ',' + cellIndex) ? 'selected' : ''}`" ref="dataItems"
            :data-id="rowIndex + ',' + cellIndex" @contextmenu.prevent="delItem(rowIndex + ',' + cellIndex)">{{ rowIndex +
              ',' + cellIndex }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
// 填入的数据
const data = ref([
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
]);
// ref绑定的所有表格dom元素
const dataItems = ref([])
// 选中框是否显示
const isSelecting = ref(false);
// 选中框的样式
const dragSelectStyle = ref({
  left: '0px',
  top: '0px',
  width: '0px',
  height: '0px'
});
// 起始点的坐标
const start_point = reactive({
  x: 0,
  y: 0
})
// 结束点的坐标
const end_point = reactive({
  x: 0,
  y: 0
})
// 选中的元素
const selectedRows = reactive(new Set());

// 鼠标按下
const handleMouseDown = (event) => {
  if (event.button === 0) {
    isSelecting.value = true;
    selectedRows.clear();

    start_point.x = event.clientX
    start_point.y = event.clientY
    dragSelectStyle.value.left = event.clientX + 'px';
    dragSelectStyle.value.top = event.clientY + 'px';
    dragSelectStyle.value.width = 0 + 'px';
    dragSelectStyle.value.height = 0 + 'px';
  }

};

// 鼠标移动
const handleMouseMove = (event) => {
  if (isSelecting.value) {
    end_point.x = event.clientX;
    end_point.y = event.clientY;

    let width = event.clientX - start_point.x;
    let height = event.clientY - start_point.y;

    dragSelectStyle.value.width = width + 'px';
    dragSelectStyle.value.height = height + 'px';
  }
};

// 鼠标抬起
const handleMouseUp = (event) => {
  if (event.button === 0) {
    updateSelectedRows();
    start_point.x = 0
    start_point.y = 0
    end_point.x = 0
    end_point.y = 0

    isSelecting.value = false;
  }

};

// 右键点击
const delItem = (v) => {
  selectedRows.delete(v);
}

// 更新数据
const updateSelectedRows = () => {
  selectedRows.clear();
  const rectA = { left: start_point.x, top: start_point.y, right: end_point.x, bottom: end_point.y };
  const rows = dataItems.value;
  rows.forEach((row, rowIndex) => {
    const rowRect = row.getBoundingClientRect();
    const rectB = { left: rowRect.left, top: rowRect.top, right: rowRect.right, bottom: rowRect.bottom };

    // 如果目标数据包含在框选框内则添加
    if (areRectanglesTouching(rectA, rectB)) {
      let id = row.getAttribute('data-id')
      selectedRows.add(id);
    }
  });
};

// 判断两个矩形是否有接触
function areRectanglesTouching(rectA, rectB) {
  return !(rectA.right < rectB.left ||
    rectA.left > rectB.right ||
    rectA.top > rectB.bottom ||
    rectA.bottom < rectB.top);
}
// 是否选中
const isSelected = (id) => {
  return selectedRows.has(id);
};

</script>

<style lang="scss">
.page-selection {
  padding: 100px 100px;
  box-sizing: border-box;
  display: flex;

  .data-show {
    width: 800px;
    background-color: #000;
    color: #fff;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    .item-show {
      width: 40px;
      height: 40px;
      border: 1px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .data-table {
    .table {
      border-collapse: collapse;
    }

    .table-row {
      display: flex;
    }

    .table-cell {
      width: 80px;
      height: 80px;
      border: 1px solid black;
      line-height: 80px;
      text-align: center;
      user-select: none;
    }

    .table-cell.selected {
      border: 1px dashed black;
      background-color: lightgray;
      color: #fff;
    }


    .drag-select {
      position: absolute;
      border: 2px dashed #000;
      background-color: rgba(0, 0, 255, 0.1);
      z-index: 2;
    }
  }
}
</style>
