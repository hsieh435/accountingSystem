<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { fetchStockList } from "@/server/outerWebApi.ts";

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
    // messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
