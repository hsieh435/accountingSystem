<template>
  <div class="inline-flex flex justify-center items-center">


    <template v-if="props.showCreate">
      <UButton class="btn-aomidori" icon="i-material-symbols:add-2-rounded" :label="props.createText" @click="clickCreateButton()" :disabled="props.createDisable" />
    </template>


    <template v-if="props.showSave">
      <UButton class="btn-midori" icon="i-ic:outline-save" :label="props.saveText" @click="clickSaveButton()" :disabled="props.saveDisable" />
    </template>


    <template v-if="props.showView">
      <UButton class="btn-tsuyukusa" icon="i-fa7-solid:binoculars" :label="props.viewText" @click="clickViewButton()" :disabled="props.viewDisable" />
    </template>


    <template v-if="props.showSearch">
      <UButton class="btn-nibi" icon="i-mage:search" :label="props.searchText" @click="clickSearchButton()" :disabled="props.searchDisable" />
    </template>


    <template v-if="props.showCopy">
      <UButton class="btn-nibi" icon="i-mage:search" :label="props.copyText" @click="clickCopyButton()" :disabled="props.copyDisable" />
    </template>


    <template v-if="props.showClose">
      <UButton class="btn-keshizumi" icon="i-material-symbols:close" :label="props.closeText" @click="clickCloseButton()" :disabled="props.closeDisable" />
    </template>


    <template v-if="props.showRemove">
      <UButton class="btn-kurenainoyashio" icon="i-jam:trash" :label="props.removeText" @click="clickRemoveButton()" :disabled="props.removeDisable" />
    </template>


  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    showCreate?: boolean;
    createText?: string;
    createDisable?: boolean;
    showSave?: boolean;
    saveText?: string;
    saveDisable?: boolean;
    showView?: boolean;
    viewText?: string;
    viewDisable?: boolean;
    showSearch?: boolean;
    searchText?: string;
    searchDisable?: boolean;
    showSend?: boolean;
    sendText?: string;
    sendDisable?: boolean;
    showPrint?: boolean;
    printText?: string;
    printDisable?: boolean;
    showCopy?: boolean;
    copyText?: string;
    copyDisable?: boolean;
    showRemove?: boolean;
    removeText?: string;
    removeDisable?: boolean;
    showClose?: boolean;
    closeText?: string;
    closeDisable?: boolean;
  }>(),
  {
    showCreate: false,
    createText: "新增",
    createDisable: false,
    showSave: false,
    saveText: "儲存",
    saveDisable: false,
    showView: false,
    viewText: "檢視",
    viewDisable: false,
    showSearch: false,
    searchText: "查詢",
    searchDisable: false,
    showSend: false,
    sendText: "送出",
    sendDisable: false,
    showPrint: false,
    printText: "下載",
    printDisable: false,
    showCopy: false,
    copyText: "複製",
    copyDisable: false,
    showRemove: false,
    removeText: "刪除",
    removeDisable: false,
    showClose: false,
    closeText: "關閉",
    closeDisable: false,
  },
);
const emits = defineEmits([
  "dataCreate",
  "dataSave",
  "dataView",
  "dataSearch",
  "dataSend",
  "dataPrint",
  "dataCopy",
  "dataRemove",
  "dataClose",
]);



async function clickCreateButton() {
  emits("dataCreate");
}



async function clickSaveButton() {
  emits("dataSave");
}


async function clickViewButton() {
  emits("dataView");
}



async function clickSearchButton() {
  emits("dataSearch");
}



async function clickSendButton() {
  emits("dataSend");
}



async function clickPrintButton() {
  emits("dataPrint");
}



async function clickCloseButton() {
  emits("dataClose");
}



async function clickCopyButton() {
  emits("dataCopy");
}



async function clickRemoveButton() {
  emits("dataRemove");
}



</script>
<style lang="scss" scoped></style>
