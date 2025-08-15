<template>
  <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
    <div class="flex items-center me-3 my-1">
      <span>{{ props.accountTypeName ? props.accountTypeName + "：" : "" }}</span>
      <accountSelect :selectTargetId="props.accountTypeId" :selectTitle="props.accountTypeName" @sendbackAccountId="settingAccountId" />
    </div>

    <div class="flex items-center me-3 my-1">
      <span>貨幣：</span><currencySelect  @sendbackCurrencyId="settingCurrency" />
    </div>

    <div class="flex items-center me-3 my-1">
      <span>收支類型：</span><tradeCategorySelect :accountType="props.accountTypeId" @sendbackTradeCategory="settingTradeCategory" />
    </div>

    <div class="flex items-center me-3 my-1">
      <span>時間區間：</span>
      <dateSelect :dateSelect="getCurrentYear() + '-01-01'" :maximumGot="searchParams.endDate" @sendbackDate="settingSettingDate" />
      <span class="mx-1">～</span>
      <dateSelect :dateSelect="getCurrentYear() + '-12-31'" :minimumGot="searchParams.startingDate" @sendbackDate="settingEndDate" />
    </div>

    <ui-buttonGroup showSearch @dataSearch="searchingRecord()" />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive } from "vue";
import { IFinanceRecordSearchingParams } from "@/models/index";
import { getCurrentYear } from "@/composables/tools";



const props = withDefaults(defineProps<{ accountTypeId?: string; accountTypeName?: string; }>(), { accountTypeId: "", accountTypeName: "請選擇" });
const emits = defineEmits(["sendbackSearchingParams"]);



const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const currencySelect = defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue"));
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));



const searchParams = reactive<IFinanceRecordSearchingParams>({
  accountId: props.accountTypeId || "",
  currencyId: "",
  tradeCategory: "",
  startingDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYear() + "-12-31",
});



async function settingAccountId(accountIdSendback: string) {
  searchParams.accountId = accountIdSendback;
}

async function settingCurrency(currencyIdSendback: string) {
  searchParams.currencyId = currencyIdSendback;
}

async function settingTradeCategory(tradeCategorySendback: string) {
  searchParams.tradeCategory = tradeCategorySendback;
}

async function settingSettingDate(dateSendback: string) {
  searchParams.startingDate = dateSendback + " 00:00:00";
}

async function settingEndDate(dateSendback: string) {
  searchParams.endDate = dateSendback + " 23:59:59";
}



async function searchingRecord() {
  // console.log("searchParams:", searchParams);
  emits("sendbackSearchingParams", searchParams);
}


</script>
<style lang="scss" scoped></style>
