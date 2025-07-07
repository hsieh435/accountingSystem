<template>
  <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full">
    <div class="flex items-center mx-3 my-2">
      <span>{{ props.accountTypeName ? props.accountTypeName + "：" : "" }}</span>
      <ui-select-accountSelect :selectId="props.accountTypeId" :selectTitle="props.accountTypeName" @sendbackRecord="settingAccountId" />
    </div>

    <div class="flex items-center mx-3 my-2">
      <span>出納類型：</span>
      <ui-select-tradeTypeSelect @sendbackTradeTypeId="settingTradeTypeId" />
    </div>

    <div class="flex items-center mx-3 my-2">
      <span>時間區間：</span>
      <ui-select-dateSelect :dateSelect="searchParams.startingDate" @sendbackRecord="settingSettingDate" />
      <span>～</span>
      <ui-select-dateSelect :dateSelect="searchParams.endDate" @sendbackRecord="settingEndDate" />
    </div>

    <ui-buttonGroup showSearch @dataSearch="searchingRecord()" />
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { getCurrentYear } from "@/composables/tools";



const props = withDefaults(defineProps<{ accountTypeId?: string; accountTypeName?: string; }>(), { accountTypeId: "", accountTypeName: "請選擇" });
const emits = defineEmits(["sendbackRecord"]);



const searchParams = reactive<{ accountId: string; tradeTypeId: string; startingDate: string; endDate: string; }>({
  accountId: "",
  tradeTypeId: "",
  startingDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYear() + "-12-31",
});



const items = [
  { label: "Option 1", value: "option-1" },
  { label: "Option 2", value: "option-2" },
  { label: "Option 3", value: "option-3" },
];


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
