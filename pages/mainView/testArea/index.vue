<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { fetchStockList } from "@/server/outerWebApi";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "其他",
  subTitle: "測試區",
});

onMounted(async () => {
  await searchingStockList();
});

async function searchingStockList() {
  try {
    const res = await fetchStockList("");
    console.log("res:", res);
  } catch (error) {
    // showAxiosErrorMsg({ message: (error as Error).message });
  }
}
</script>
<style lang="scss" scoped></style>
