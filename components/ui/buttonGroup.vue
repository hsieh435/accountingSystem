<template>
  <div class="flex justify-center items-center">

    <template v-if="props.showFilming">
      <span class="mx-3"><span class="text-danger mx-1">∗</span>{{ props.filmingText }}</span>
    </template>


    <template v-if="props.showCreate">
      <UButton class="cursor-pointer mx-2 px-2 py-1" color="secondary" @click="clickCreateButton()" :disabled="props.createDisable">
        <font-awesome-icon class="mx-1" :icon="['fas', 'plus']" />{{ props.createText }}
      </UButton>
    </template>


    <template v-if="props.showSave">
      <UButton class="cursor-pointer mx-2 px-2 py-1" color="primary" @click="clickSaveButton()" :disabled="props.saveDisable">
        <font-awesome-icon class="mx-1" :icon="['far', 'save']" />{{ props.saveText }}
      </UButton>
    </template> 


    <template v-if="props.showSearch">
      <UButton class="cursor-pointer mx-2 px-2 py-1" color="neutral" @click="clickSearchButton()" :disabled="props.searchDisable" type="button">
        <font-awesome-icon class="mx-1" :icon="['fas', 'magnifying-glass']" />{{ props.searchText }}
      </UButton>
    </template>


    <template v-if="props.showRemove">
      <UButton class="cursor-pointer mx-2 px-2 py-1" color="error" @click="clickRemoveButton()" :disabled="props.removeDisable">
        <font-awesome-icon class="mx-1" :icon="['fas', 'trash-can']" />{{ props.removeText }}
      </UButton>
    </template> 


  </div>
</template>
<script setup lang="ts">



const props = withDefaults(defineProps<{
  showFilming?: boolean;
  filmingText?: string;
  showCreate?: boolean;
  createText?: string;
  createDisable?: boolean;
  showSave?: boolean;
  saveText?: string;
  saveDisable?: boolean;
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
}>(), {
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
