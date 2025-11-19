<template>
  <select :class="tailwindStyles.getSelectClasses()" v-model="currencyId" :disabled="isSelectDisabled">
    <option v-for="currency in currencyArray" :key="currency.value" :value="currency.value">
      {{ currency.value }} {{ currency.label }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchCurrencyList } from "@/server/parameterApi";
import { ISelectData, ICurrencyList, IResponse } from "@/models/index";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { messageToast } from "@/composables/swalDialog";

const props = withDefaults(defineProps<{ currencyIdGot?: string; sellectAll?: boolean; isDisable?: boolean }>(), {
  currencyIdGot: "",
  sellectAll: true,
  isDisable: false,
});
const emits = defineEmits(["sendbackCurrencyData"]);

const currencyId = ref<string>("");
const isSelectDisabled = ref<boolean>(false);
const currencyList = ref<ICurrencyList[]>([]);
const currencyArray = ref<ISelectData[]>([]);
const getDefaultCurrencyItem = (): ICurrencyList => ({
  currencyCode: "",
  currencyName: "",
  currencySymbol: "",
  minimumDenomination: 0.1,
  sort: 50,
});

onMounted(async () => {
  // console.log("onMounted props:", props);
  await searchingCurrencyList();
  isSelectDisabled.value = props.isDisable;
  currencyId.value = props.currencyIdGot;
});

watch(props, async () => {
  // console.log("watch props:", props);
  isSelectDisabled.value = props.isDisable;
  currencyId.value = props.currencyIdGot;
});

watch(currencyId, () => {
  // console.log("onMounted watch:", props);
  // console.log("currencyId:", currencyId.value);
  // emits("sendbackCurrencyData", currencyId.value);
  for (let i = 0; i < currencyList.value.length; i++) {
    if (currencyList.value[i].currencyCode === currencyId.value) {
      emits("sendbackCurrencyData", currencyList.value[i]);
      break;
    }
    if (currencyId.value === "") {
      emits("sendbackCurrencyData", getDefaultCurrencyItem());
    }
  }
});

async function searchingCurrencyList() {
  currencyArray.value = [];

  try {
    const res: IResponse = await fetchCurrencyList();
    // console.log("fetchCurrencyList:", res.data.data);
    currencyList.value = res.data.data;
    currencyArray.value = res.data.data.map((item: ICurrencyList) => ({
      label: item.currencyName,
      value: item.currencyCode,
    }));

    if (props.sellectAll) {
      currencyArray.value.unshift({ label: "所有貨幣", value: "" });
    } else if (props.sellectAll === false && !props.currencyIdGot) {
      currencyId.value = currencyArray.value[0].value;
    }
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
