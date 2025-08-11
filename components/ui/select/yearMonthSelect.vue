<template>
  <UInput v-model="yearMonth" type="month" :month-controls="true" icon="i-lucide-calendar" />
</template>
<script setup lang="ts">
import { ref, watch } from "vue";



const yearMonth = ref<string>("");



watch(yearMonth, () => {
  console.log("yearMonth:", yearMonth.value);
});



async function handleLogin() {
  // 在此加入 API 呼叫與驗證邏輯
};
</script>
<style lang="scss" scoped></style>
