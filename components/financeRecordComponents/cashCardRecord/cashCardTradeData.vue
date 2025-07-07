<template>  
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視儲值票卡收支'" @dataView="searchingCashCardRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增儲值票卡收支'" @dataCreate="cashCardRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";




const props = withDefaults(defineProps<{ tradeIdGot?: string; }>(), { tradeIdGot: "", });
const emits = defineEmits(["dataReseaching"]);




async function searchingCashCardRecord() {
  // 在這裡可以加入 API 呼叫來獲取儲值票卡資料
  // cashCardRecordDataHandling();
  
}


async function cashCardRecordDataHandling(apiMsg?: string) {
  // console.log(dataParams);
}


</script>
<style lang="scss" scoped></style>
