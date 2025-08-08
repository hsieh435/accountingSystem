<template>
  <div class="flex justify-start items-center">
    <div class="flex flex-wrap justify-start items-center me-3 my-2">
      <span>貨幣：</span><currencySelect @sendbackCurrencyId="settingCurrency" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, watch } from "vue";
import { IAccountSearchingParams } from "@/models/index";



const currencySelect = defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue"));



const emits = defineEmits(["sendbackSearchingParams"]);



const searchingParams = reactive<IAccountSearchingParams>({
  currencyId: "",
});



watch(
  () => searchingParams,
  () => {
    // console.log("searchingParams:", searchingParams);
    emits("sendbackSearchingParams", searchingParams);
  },
  {
    deep: true,
  },
);



async function settingCurrency(currencyIdSendback: string) {
  searchingParams.currencyId = currencyIdSendback;
}


</script>
<style lang="scss" scoped></style>
