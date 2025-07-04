<template>
  <div class="flex justify-center items-center">
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ICashFlowData } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "現金資料設定",
})


const cashFlowData = ref<ICashFlowData>({  
  userId: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  createdDate: "",
});

</script>
<style lang="scss" scoped></style>
