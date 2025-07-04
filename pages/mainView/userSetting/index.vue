<template>
  <UForm ref="form">
    <div class="grid grid-cols-3 gap-2">
      <UFormField  label="Input" name="input">
        <UInput placeholder="john@lennon.com" />
      </UFormField>

      <UFormField label="Select" name="select">
        <USelect :items="items" class="w-48" />
      </UFormField>
    </div>

    <div class="flex gap-2 mt-8">
      <ui-buttonGroup :showSave="true" :saveText="'修改'" @dataSave="submitUserData()" />
    </div>
  </UForm>
</template>
<script setup lang="ts">
import { ref } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "使用者資料設定",
})



const items = [
  { label: "Option 1", value: "option-1" },
  { label: "Option 2", value: "option-2" },
  { label: "Option 3", value: "option-3" },
];

// const toast = useToast();
async function submitUserData() {
  console.log(100);
}


</script>
<style lang="scss" scoped></style>
<!-- https://ui.nuxt.com/components/form -->
