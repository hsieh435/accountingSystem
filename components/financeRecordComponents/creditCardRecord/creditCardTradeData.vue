<template>  
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視信用卡收支'" @dataView="searchingCreditCardRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增信用卡收支'" @dataCreate="creditCardRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";




const props = withDefaults(defineProps<{ tradeIdGot?: string; }>(), { tradeIdGot: "", });
const emits = defineEmits(["dataReseaching"]);




async function searchingCreditCardRecord() {
  // creditCardRecordDataHandling();  
}


async function creditCardRecordDataHandling(apiMsg?: string) {
  // console.log(dataParams);
}


</script>
<style lang="scss" scoped></style>
