<template>  
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視證券帳戶收支'" @dataView="searchingStockAccountRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增證券帳戶收支'" @dataCreate="stockAccountRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";




const props = withDefaults(defineProps<{ tradeIdGot?: string; }>(), { tradeIdGot: "", });
const emits = defineEmits(["dataReseaching"]);




async function searchingStockAccountRecord() {
  // stockAccountRecordDataHandling();  
}


async function stockAccountRecordDataHandling(apiMsg?: string) {
  // console.log(dataParams);
}


</script>
<style lang="scss" scoped></style>
