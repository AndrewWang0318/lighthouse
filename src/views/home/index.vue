<template>
  <div class="data-table" @mousemove="handleMouseMove" @mouseup="handleMouseUp">
    <div v-if="isSelecting" class="drag-select" :style="dragSelectStyle"></div>
    <div class="table" @mousedown="handleMouseDown">
      <div class="table-row" v-for="(rowItem, rowIndex) in data" :key="rowIndex">
        <div :class="`table-cell ${{'selected': isSelected(rowIndex,cellIndex)}}`"  
          v-for="(cellItem, cellIndex) in row" :key="cellIndex">
          {{ rowIndex + ',' + cellIndex }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const data = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
];
const selectedRows = new Set();
const isSelecting = ref(false);
const startX = ref(0);
const startY = ref(0);
const endX = ref(0);
const endY = ref(0);

const dragSelectStyle = ref({
  left: '0px',
  top: '0px',
  width: '0px',
  height: '0px'
});

// 鼠标按下
const handleMouseDown = (event) => {
  isSelecting.value = true;
  startX.value = event.clientX;
  startY.value = event.clientY;

  dragSelectStyle.value.left = event.clientX + 'px';
  dragSelectStyle.value.top = event.clientY + 'px';
  dragSelectStyle.value.width = 0 + 'px';
  dragSelectStyle.value.height = 0 + 'px';


  selectedRows.clear();
};

// 鼠标移动
const handleMouseMove = (event) => {
  if (isSelecting.value) {
    endX.value = event.clientX;
    endY.value = event.clientY;

    // console.log(event)


    dragSelectStyle.value.width = (event.clientX) + 'px';
    dragSelectStyle.value.height = (event.clientY) + 'px';
    
  }
};

const handleMouseUp = () => {
  updateSelectedRows();

  isSelecting.value = false;
  startX.value = 0;
  startY.value = 0;
  endX.value = 0;
  endY.value = 0;
};

const updateSelectedRows = () => {
  const tableRect = document.querySelector('.data-table').getBoundingClientRect();

  const minX = Math.min(startX.value, endX.value) - tableRect.left;
  const maxX = Math.max(startX.value, endX.value) - tableRect.left;
  const minY = Math.min(startY.value, endY.value) - tableRect.top;
  const maxY = Math.max(startY.value, endY.value) - tableRect.top;

  selectedRows.clear();
  const rows = document.querySelectorAll('.table-row');

  rows.forEach((row, rowIndex) => {
    const rowRect = row.getBoundingClientRect();
    if (rowRect.left < maxX && rowRect.right > minX && rowRect.top < maxY && rowRect.bottom > minY) {
      selectedRows.add(rowIndex);
    }
  });
};

const isSelected = (rowIndex) => {
  return selectedRows.has(rowIndex);
};





</script>

<style lang="scss">
.data-table {
  // position: relative;
  // width: 300px;
  // height: 200px;
  // overflow: auto;
  /* margin: 60px auto; */
  display: inline-block;
}

.table {
  border-collapse: collapse;
}

.table-row {
  display: flex;
}

.table-cell {
  width: 40px;
  height: 40px;
  border: 1px solid black;
  line-height: 40px;
  text-align: center;
  user-select: none;
}

.selected .table-cell {
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
</style>
