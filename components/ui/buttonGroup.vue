<template>
  <div class="inline-flex flex justify-center items-center">

    <template v-if="props.showFilming">
      <span class="mx-3"><span class="text-red-600 mx-1">∗</span>{{ props.filmingText }}</span>
    </template>


    <template v-if="props.showCreate">
      <!-- <button class="btn-aomidori" @click="clickCreateButton()" :disabled="props.createDisable">
        <font-awesome-icon :icon="['fas', 'plus']" /><span>{{ props.createText }}</span>
      </button> -->
      <UButton class="btn-aomidori" @click="clickCreateButton()" :disabled="props.createDisable">
        <font-awesome-icon :icon="['fas', 'plus']" /><span>{{ props.createText }}</span>
      </UButton>
    </template>


    <template v-if="props.showSave">
      <!-- <button class="btn-aomidori" @click="clickSaveButton()" :disabled="props.saveDisable">
        <font-awesome-icon :icon="['far', 'save']" /><span>{{ props.saveText }}</span>
      </button> -->
      <UButton class="btn-aomidori" @click="clickSaveButton()" :disabled="props.saveDisable">
        <font-awesome-icon :icon="['far', 'save']" /><span>{{ props.saveText }}</span>
      </UButton>
    </template>


    <template v-if="props.showView">
      <!-- <button class="btn-shinbashi" @click="clickViewButton()" :disabled="props.viewDisable">
        <font-awesome-icon :icon="['fas', 'binoculars']" /><span>{{ props.viewText }}</span>
      </button> -->
      <UButton class="btn-shinbashi" @click="clickViewButton()" :disabled="props.viewDisable">
        <font-awesome-icon :icon="['fas', 'binoculars']" /><span>{{ props.viewText }}</span>
      </UButton>
    </template>


    <template v-if="props.showSearch">
      <!-- <button class="btn-nibi" @click="clickSearchButton()" :disabled="props.searchDisable" type="button">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" /><span>{{ props.searchText }}</span>
      </button> -->
      <UButton class="btn-nibi" @click="clickSearchButton()" :disabled="props.searchDisable">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" /><span>{{ props.searchText }}</span>
      </UButton>
    </template>


    <template v-if="props.showClose">
      <!-- <button class="btn-keshizumi" @click="clickCloseButton()" :disabled="props.closeDisable">
        <font-awesome-icon :icon="['fas', 'x']" /><span>{{ props.closeText }}</span>
      </button> -->
      <UButton class="btn-keshizumi" @click="clickCloseButton()" :disabled="props.closeDisable">
        <font-awesome-icon :icon="['fas', 'x']" /><span>{{ props.closeText }}</span>
      </UButton>
    </template>


    <template v-if="props.showRemove">
      <!-- <button class="btn-kurenainoyashio" @click="clickRemoveButton()" :disabled="props.removeDisable">
        <font-awesome-icon :icon="['fas', 'trash-can']" /><span>{{ props.removeText }}</span>
      </button> -->
      <UButton class="btn-kurenainoyashio" @click="clickRemoveButton()" :disabled="props.removeDisable">
        <font-awesome-icon :icon="['fas', 'trash-can']" /><span>{{ props.removeText }}</span>
      </UButton>
    </template>


  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    showFilming?: boolean;
    filmingText?: string;
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
    showFilming: false,
    filmingText: "必填欄位，不可空白",
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
