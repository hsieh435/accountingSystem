<template>
  <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
    <div class="flex items-center me-3 my-1">
      <span>貨幣：</span><currencySelect sellectAll @sendbackCurrencyId="settingCurrency" />
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



watch(searchingParams, () => {
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
