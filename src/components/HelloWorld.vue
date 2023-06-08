<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <h2>{{ count }}</h2>
  <div class="card">
    <button type="button" @click="count++">增加</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
