<template>
  <select :class="tailwindStyles.selectClasses" v-model="currencyId" :disabled="props.isDisable">
    <option v-for="currency in currencyArray" :key="currency.value" :value="currency.value">
      {{ currency.value }} {{ currency.label }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchCurrencyList } from "@/server/currencyApi";
import { ISelectData, ICurrency, IResponse } from "@/models/index";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosErrorMsg } from "@/composables/swalDialog";



const props = withDefaults(defineProps<{ currencyIdGot?: string; sellectAll?: boolean; isDisable?: boolean }>(), { currencyIdGot: "", sellectAll: true, isDisable: false });
const emits = defineEmits(["sendbackCurrencyId"]);



const currencyId = ref<string>("");
const isSelectDisabled = ref<boolean>(false);
const currencyArray = ref<ISelectData[]>([]);



onMounted(async () => {
  // console.log("onMounted props:", props);
  await searchingCurrencyList();
  if (props.currencyIdGot) {
    isSelectDisabled.value = props.isDisable;
    currencyId.value = props.currencyIdGot;
  }
});

watch(props, async () => {
  // console.log("watch props:", props);
  if (props.currencyIdGot) {
    isSelectDisabled.value = props.isDisable;
    currencyId.value = props.currencyIdGot;
  }
});

watch(currencyId, () => {
  // console.log("onMounted watch:", props);
  // console.log("currencyId:", currencyId.value);
  emits("sendbackCurrencyId", currencyId.value);
});



async function searchingCurrencyList() {
  currencyArray.value = [];

  try {
    const res = (await fetchCurrencyList()) as IResponse;
    // console.log("fetchCurrencyList:", res);
    if (res.data.returnCode === 0) {
      currencyArray.value = res.data.data.map((item: ICurrency) => ({
        label: item.currencyName,
        value: item.currencyCode
      }));

      if (props.sellectAll) {
        currencyArray.value.unshift({ label: "所有貨幣", value: "" });
      } else if (props.sellectAll === false && !props.currencyIdGot) {
        currencyId.value = currencyArray.value[0].value;
        emits("sendbackCurrencyId", currencyId.value);
      }
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}



</script>
<style lang="scss" scoped></style>
