<template>
  <div class="flex justify-start items-center">
    <select class="block border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white mx-1 px-2 py-1" v-model="tradeCategoryId">
      <option value="">請選擇</option>
      <option value="category1">Category 1</option>
      <option value="category2">Category 2</option>
      <option value="category3">Category 3</option>
      <!-- <option v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</option> -->
    </select>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";



const props = withDefaults(defineProps<{ tradeCategoryGot?: string; }>(), { tradeCategoryGot: "", });
const emits = defineEmits(["sendbackTradeCategory"]);



const tradeCategoryId = ref<string>("");



onMounted(async () => {
  tradeCategoryId.value = props.tradeCategoryGot || "";
  await searchingTradeType();
});

watch(tradeCategoryId, () => {
  emits("sendbackTradeCategory", tradeCategoryId.value);
});



async function searchingTradeType() {
  // 在此加入 API 呼叫與驗證邏輯
};
</script>
<style lang="scss" scoped></style>
