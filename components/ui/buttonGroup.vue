<template>
  <div class="inline-flex flex justify-center items-center">


    <template v-if="props.showCreate">
      <UButton class="btn-aomidori" @click="clickCreateButton()" :disabled="props.createDisable" >
        <font-awesome-icon :icon="['fas', 'plus']" /><span>{{ props.createText }}</span>
      </UButton>
    </template>


    <template v-if="props.showSave">
      <UButton class="btn-midori" @click="clickSaveButton()" :disabled="props.saveDisable" >
        <font-awesome-icon :icon="['far', 'save']" /><span>{{ props.saveText }}</span>
      </UButton>
    </template>


    <template v-if="props.showView">
      <UButton class="btn-tsuyukusa" @click="clickViewButton()" :disabled="props.viewDisable" >
        <font-awesome-icon :icon="['fas', 'binoculars']" /><span>{{ props.viewText }}</span>
      </UButton>
    </template>


    <template v-if="props.showSearch">
      <UButton class="btn-nibi" @click="clickSearchButton()" :disabled="props.searchDisable" >
        <font-awesome-icon :icon="['fas', 'search']" /><span>{{ props.searchText }}</span>
      </UButton>
    </template>


    <template v-if="props.operation">
      <UButton class="btn-shion" @click="clickOperateButton()" :disabled="props.operationDisable" >
        <font-awesome-icon :icon="['fas', 'tools']" /><span>{{ props.operationText }}</span>
      </UButton>
    </template>


    <template v-if="props.showClose">
      <UButton class="btn-keshizumi" @click="clickCloseButton()" :disabled="props.closeDisable" >
        <font-awesome-icon :icon="['fas', 'times']" /><span>{{ props.closeText }}</span>
      </UButton>
    </template>


    <template v-if="props.showRemove">
      <UButton class="btn-kurenainoyashio" @click="clickRemoveButton()" :disabled="props.removeDisable" >
        <font-awesome-icon :icon="['fas', 'trash']" /><span>{{ props.removeText }}</span>
      </UButton>
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
    operation?: boolean;
    operationText?: string;
    operationDisable?: boolean;
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
    operation: false,
    operationText: "操作",
    operationDisable: false,
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
  "dataOperate",
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



async function clickOperateButton() {
  emits("dataOperate");
}



async function clickCloseButton() {
  emits("dataClose");
}



async function clickRemoveButton() {
  emits("dataRemove");
}



</script>
<style lang="scss" scoped></style>
