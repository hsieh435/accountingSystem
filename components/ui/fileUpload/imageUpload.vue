<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">

    <input id="upload" type="file">
    <label type="button" for="upload" class="uploadStyle">
      <span>選擇圖像</span>
    </label>

  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";




</script>
<style lang="scss" scoped>
input[type="file"] {
  display: none;
}

.uploadStyle {
  /* label的樣式 */
}
</style>
