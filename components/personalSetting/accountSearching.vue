<template>
  <div class="w-full bg-gray-100 flex flex-wrap justify-start items-center gap-x-3 gap-y-1 px-3 py-1">
    <div class="flex items-center">
      <span>貨幣：</span><dataBaseCurrencySelect sellectAll @sendbackCurrencyData="settingCurrency" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, watch } from "vue";
import { IAccountSearchingParams, ICurrencyList } from "@/models/index.ts";

const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));

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

function settingCurrency(currencyData: ICurrencyList) {
  searchingParams.currencyId = currencyData.currencyCode;
}
</script>
<style lang="scss" scoped></style>
