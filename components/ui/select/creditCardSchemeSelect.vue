<template>
  <div class="flex justify-start items-center">
    <!-- <span class="block text-sm font-medium text-gray-700 mx-1">{{ props.selectTitle }}：</span> -->
    <select class="block border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white mx-1 px-2 py-1" v-model="accountId" :disabled="isSelectDisabled" >
      <option value="">請選擇{{ props.selectTitle }}</option>
      <option value="category1">Category 1</option>
      <option value="category2">Category 2</option>
      <option value="category3">Category 3</option>
      <!-- <option v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</option> -->
    </select>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";




const props = withDefaults(defineProps<{ selectId?: string; selectTitle?: string }>(), { selectId: "", selectTitle: "", });
const emits = defineEmits(["sendbackAccountId"]);



const accountId = ref<string>("");
const isSelectDisabled = ref<boolean>(true);



onMounted(async () => {
  if (props.selectId) {
    await searchingAccountLists();
    isSelectDisabled.value = false;
  }
});

watch(accountId, () => {
  emits("sendbackAccountId", accountId.value);
});



async function searchingAccountLists() {
  // 在此加入 API 呼叫與驗證邏輯
};
</script>
<style lang="scss" scoped></style>
