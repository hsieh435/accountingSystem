<template>
  <div class="flex justify-start items-center">
    <select :class="tailwindStyles.selectClasses" v-model="currencyId">
      <option v-for="currency in currencyList" :key="currency.value" :value="currency.value" :disabled="props.currencyArray.includes(currency.value)">
        {{ currency.label }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



const props = withDefaults(defineProps<{ currencyIdGot?: string; currencyArray?: string[]; sellectAll?: boolean; isDisable?: boolean }>(), { currencyIdGot: "", currencyArray: () => [], sellectAll: true, isDisable: false });
const emits = defineEmits(["sendbackCurrencyId"]);



const currencyId = ref<string>("");
const isSelectDisabled = ref<boolean>(false);
const currencyList = ref<{ label: string; value: string; }[]>([]);



onMounted(async () => {
  if (props.currencyIdGot) {
    await searchingCurrencyList();
    isSelectDisabled.value = props.isDisable;
    currencyId.value = props.currencyIdGot;
  }
});

watch(currencyId, () => {
  console.log("currencyId:", currencyId.value);
  emits("sendbackCurrencyId", currencyId.value);
});



async function searchingCurrencyList() {
  currencyList.value = [];


  // .map

  if (props.sellectAll) {
    currencyList.value.unshift({ label: "所有", value: "" });
  }

};



</script>
<style lang="scss" scoped></style>
