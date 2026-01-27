<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { fetchStockList } from "@/server/outerWebApi.ts";

declare function definePageMeta(meta: { [key: string]: string }): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "參數設定",
  subTitle: "信用卡額度設定",
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
