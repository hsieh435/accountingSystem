<template>
  <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full">
    <div class="flex items-center mx-3 my-2">
      <span>{{ props.accountTypeName ? props.accountTypeName + "：" : "" }}</span>
      <accountSelect :selectTargetId="props.accountTypeId" :selectTitle="props.accountTypeName" @sendbackRecord="settingAccountId" />
    </div>

    <div class="flex items-center mx-3 my-2">
      <span>收支類型：</span><tradeCategorySelect @sendbackTradeTypeId="settingTradeTypeId" />
    </div>

    <div class="flex items-center mx-3 my-2">
      <span>時間區間：</span>
      <dateSelect :dateSelect="searchParams.startingDate" @sendbackRecord="settingSettingDate" />
      <span>～</span>
      <dateSelect :dateSelect="searchParams.endDate" @sendbackRecord="settingEndDate" />
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
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));



const searchParams = reactive<{ accountId: string; tradeTypeId: string; startingDate: string; endDate: string; }>({
  accountId: props.accountTypeId || "",
  tradeTypeId: "",
  startingDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYear() + "-12-31",
});



async function settingAccountId(accountIdSendback: string) {
  searchParams.accountId = accountIdSendback;
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
