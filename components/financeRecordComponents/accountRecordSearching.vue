<template>
  <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
    <div class="flex items-center me-3 my-1">
      <span>{{ props.accountTypeName ? props.accountTypeName + "：" : "" }}</span>
      <accountSelect :selectTargetId="props.accountTypeId" :selectTitle="props.accountTypeName" @sendbackRecord="settingAccountId" />
    </div>

    <div class="flex items-center me-3 my-1">
      <span>貨幣：</span><currencySelect  @sendbackCurrencyId="settingCurrency" />
    </div>

    <div class="flex items-center me-3 my-1">
      <span>收支類型：</span><tradeCategorySelect :accountType="props.accountTypeId" @sendbackTradeTypeId="settingTradeTypeId" />
    </div>

    <div class="flex items-center me-3 my-1">
      <span>時間區間：</span>
      <dateSelect :dateSelect="searchParams.startingDate" :maximumGot="searchParams.endDate" @sendbackRecord="settingSettingDate" />
      <span>～</span>
      <dateSelect :dateSelect="searchParams.endDate" :minimumGot="searchParams.startingDate" @sendbackRecord="settingEndDate" />
    </div>

    <ui-buttonGroup showSearch @dataSearch="searchingRecord()" />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive } from "vue";
import { getCurrentYear } from "@/composables/tools";



const props = withDefaults(defineProps<{ accountTypeId?: string; accountTypeName?: string; }>(), { accountTypeId: "", accountTypeName: "請選擇" });
const emits = defineEmits(["sendbackRecord"]);



const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const currencySelect = defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue"));
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));



const searchParams = reactive<{ accountId: string; currency: string; tradeTypeId: string; startingDate: string; endDate: string; }>({
  accountId: props.accountTypeId || "",
  currency: "",
  tradeTypeId: "",
  startingDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYear() + "-12-31",
});



async function settingAccountId(accountIdSendback: string) {
  searchParams.accountId = accountIdSendback;
}

async function settingCurrency(currencyIdSendback: string) {
  searchParams.currency = currencyIdSendback;
}

async function settingTradeTypeId(tradeTypeSendback: string) {
  searchParams.tradeTypeId = tradeTypeSendback;
}

async function settingSettingDate(dateSendback: string) {
  searchParams.startingDate = dateSendback;
}

async function settingEndDate(dateSendback: string) {
  searchParams.endDate = dateSendback;
}



async function searchingRecord() {
  console.log("searchParams:", searchParams);
  emits("sendbackRecord");
}


</script>
<style lang="scss" scoped></style>
