<template>
  <div class="flex justify-start items-center">
    <select :class="tailwindStyles.selectClasses" v-model="currencyId">
      <option value="" v-if="props.sellectAll">所有貨幣</option>
      <option v-for="currency in currencyList" :key="currency.currencyCode" :value="currency.currencyCode" :disabled="props.currencyArray.includes(currency.currencyCode)">
        {{ currency.currencyCode }} - {{ currency.currencyName }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchCurrencyList } from "@/server/currencyApi";
import { ICurrency, IResponse } from "@/models/index";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";



const props = withDefaults(defineProps<{ currencyIdGot?: string; currencyArray?: string[]; sellectAll?: boolean; isDisable?: boolean }>(), { currencyIdGot: "", currencyArray: () => [], sellectAll: true, isDisable: false });
const emits = defineEmits(["sendbackCurrencyId"]);



const currencyId = ref<string>("");
const isSelectDisabled = ref<boolean>(false);
const currencyList = ref<ICurrency[]>([]);



onMounted(async () => {
  await searchingCurrencyList();
  if (props.currencyIdGot) {
    isSelectDisabled.value = props.isDisable;
    currencyId.value = props.currencyIdGot;
  }
});

watch(currencyId, () => {
  // console.log("currencyId:", currencyId.value);
  emits("sendbackCurrencyId", currencyId.value);
});



async function searchingCurrencyList() {
  currencyList.value = [];
  try {
    const res = (await fetchCurrencyList()) as IResponse;
    console.log("fetchCurrencyList:", res);
    if (res.data.returnCode === 0) {
      currencyList.value = res.data.data;
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}



</script>
<style lang="scss" scoped></style>
