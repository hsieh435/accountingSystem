<template>  
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視銀行帳戶收支'" @dataView="searchingCurrencyAccountRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增銀行帳戶收支'" @dataCreate="currencyAccountRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";




const props = withDefaults(defineProps<{ tradeIdGot?: string; }>(), { tradeIdGot: "", });
const emits = defineEmits(["dataReseaching"]);




async function searchingCurrencyAccountRecord() {
  // currencyAccountRecordDataHandling();  
}


async function currencyAccountRecordDataHandling(apiMsg?: string) {
  // console.log(dataParams);
}


</script>
<style lang="scss" scoped></style>
