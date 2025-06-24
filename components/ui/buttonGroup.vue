<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">


    <template v-if="props.showFilming">
      <!-- <span class="mx-3"><span class="text-danger mx-1">∗</span>{{ props.filmingText }}</span> -->
    </template>


    <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
      <span>綠色按鈕</span>
    </button>
    <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
      <span>藍色按鈕</span>
    </button>
    <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
      <span>紅色按鈕</span>
    </button>

  </div>
</template>
<script setup lang="ts">



const props = withDefaults(defineProps({
  showFilming: boolean,
  filmingText: string,
  showCreate: boolean,
  createText: string,
  createDisable: boolean,
  showSave: boolean,
  saveText: string,
  saveDisable: boolean,
  showSearch: boolean,
  searchText: string,
  searchDisable: boolean,
  showSend: boolean,
  sendText: string,
  sendDisable: boolean,
  showPrint: boolean,
  printText: string,
  printDisable: boolean,
  showCopy: boolean,
  copyText: string,
  copyDisable: boolean,
  showRemove: boolean,
  removeText: string,
  removeDisable: boolean,
  showClose: boolean,
  closeText: string,
  closeDisable: boolean
}), {
  showFilming: false,
  filmingText: "必填欄位，不可空白",
  showCreate: false,
  createText: "新增",
  createDisable: false,
  showSave: false,
  saveText: "儲存",
  saveDisable: false,
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
  closeDisable: false
});
const emits = defineEmits(["dataCreate", "dataSave", "dataSearch", "dataSend", "dataPrint", "dataCopy", "dataRemove", "dataClose"]);



async function clickCreateButton() {
  emits("dataCreate");
}



async function clickSaveButton() {
  emits("dataSave");
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