<template>
  <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
    <div class="flex items-center me-3 my-1">
      <span>貨幣：</span><currencySelect @sendbackCurrencyId="settingCurrencyId" />
    </div>
    <ui-buttonGroup showSearch :searchDisable="!searchingParams.currencyId" @dataSearch="searchingCurrencyExRate()" />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive } from "vue";
import { fetchCurrencyExRateInfoList } from "@/server/outerWebApi";
import { ICurrencyExRateSearchingParams, IResponse } from "@/models/index";
import { getCurrentYear, getCurrentMonth } from "@/composables/tools";
import { showAxiosErrorMsg } from "@/composables/swalDialog";

const emits = defineEmits(["sendbackSearchingData"]);

const currencySelect = defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue"));

const searchingParams = reactive<ICurrencyExRateSearchingParams>({
  currencyId: "",
});

async function settingCurrencyId(currencyId: string) {
  searchingParams.currencyId = currencyId;
}


async function searchingCurrencyExRate() {
  // emits("sendbackSearchingData", searchingParams);

  try {
    const res: IResponse = await fetchCurrencyExRateInfoList(searchingParams.currencyId);
    console.log("fetchCurrencyExRateInfoList:", res.data.data);
    if (res.data.returnCode === 0) {
      //
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}
</script>
<style lang="scss" scoped></style>
