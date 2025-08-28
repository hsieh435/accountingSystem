<template>
  <UInputMenu
    v-model="stockSelected"
    value-key="value"
    :items="filteredStockList"
    @input="onSearch"
    placeholder="搜尋 股票代碼或名稱"
    :loading="loading"
    loading-icon="i-lucide-loader"
    :disabled="props.isDisable" />
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchStockList } from "@/server/outerWebApi";
import { IResponse } from "@/models/index";
import { debounceFn } from "@/composables/tools";
import { showAxiosErrorMsg } from "@/composables/swalDialog";

const props = withDefaults(defineProps<{ isDisable?: boolean }>(), { isDisable: false });
const emits = defineEmits(["sendbackStockNo"]);

const stockSelected = ref<string>("");
const rawStockList = ref<{ label: string; value: string }[]>([]);
const filteredStockList = ref<{ label: string; value: string }[]>([]);
const loading = ref<boolean>(false);

watch(stockSelected, () => {
  // console.log("stockSelected:", stockSelected.value);
  const selectedItem = filteredStockList.value.find((item) => item.value === stockSelected.value);
  const selectedData = {
    value: stockSelected.value,
    label: selectedItem?.label || "",
  };
  emits("sendbackStockNo", selectedData);
});

function onSearch(event: Event) {
  debounceSearchStocks((event.target as HTMLInputElement).value);
}

const debounceSearchStocks = debounceFn(async (keyword: string) => {
  if (!keyword || keyword.trim().length < 1) {
    filteredStockList.value = [];
    stockSelected.value = "";
  } else {

    loading.value = true;
    try {
      const res: IResponse = await fetchStockList(keyword.trim());
      // console.log("res:", JSON.parse(res.data.data));
      if (res.data.returnCode === 0) {
        rawStockList.value = JSON.parse(res.data.data);
        filteredStockList.value = rawStockList.value.map((item: { label: string; value: string }) => ({
          label: item.label,
          value: item.value,
        }));
      } else {
        showAxiosErrorMsg({ message: res.data.message });
      }
    } catch (error) {
      showAxiosErrorMsg({ message: (error as Error).message });
    } finally {
      loading.value = false;
    }
  }
});
</script>
