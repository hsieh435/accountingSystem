<template>
  <UInputMenu
    v-model="currencyId"
    value-key="value"
    :items="currencyArray"
    @input="onSearch"
    placeholder="搜尋 貨幣代號或名稱"
    :loading="loading"
    loading-icon="i-lucide-loader"
    :disabled="props.isDisable" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchCurrencyListFromWeb } from "@/server/outerWebApi";
import { ISelectData, IResponse } from "@/models/index";
import { debounceFn } from "@/composables/tools";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";

const props = withDefaults(defineProps<{ currencyIdGot?: string; isDisable?: boolean }>(), {
  currencyIdGot: "",
  isDisable: false,
});
const emits = defineEmits(["sendbackCurrencyId"]);

const currencyId = ref<string>("");
const isSelectDisabled = ref<boolean>(false);
const currencyArray = ref<ISelectData[]>([]);
const rawCurrencyList = ref<{ currencyCode: string; currencyName: string }[]>([]);
const loading = ref<boolean>(false);

onMounted(async () => {
  // console.log("onMounted props:", props);
  // await searchingCurrencyList();
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
  console.log("currencyId:", currencyId.value);
  if (currencyId.value) {
    const selectedItem = rawCurrencyList.value.find((item) => item.currencyCode === currencyId.value);
    emits("sendbackCurrencyId", selectedItem);
  } else {
    return;
  }
});

function onSearch(event: Event) {
  debounceSearchStocks((event.target as HTMLInputElement).value);
}

const debounceSearchStocks = debounceFn(async (keyword: string) => {
  if (!keyword || keyword.trim().length < 1) {
    currencyArray.value = [];
    currencyId.value = "";
  } else {
    loading.value = true;
    try {
      const res: IResponse = await fetchCurrencyListFromWeb(keyword);
      // console.log("fetchCurrencyListFromWeb:", res.data.data);
      if (res.data.returnCode === 0) {
        rawCurrencyList.value = JSON.parse(res.data.data);
        currencyArray.value = rawCurrencyList.value.map((item: { currencyCode: string; currencyName: string }) => ({
          label: item.currencyCode + " - " + item.currencyName,
          value: item.currencyCode,
        }));
      } else {
        errorMessageDialog({ message: res.data.data.result });
      }
    } catch (error) {
      messageToast({ message: (error as Error).message, icon: "error" });
    } finally {
      loading.value = false;
    }
  }
});
</script>
<style lang="scss" scoped></style>
