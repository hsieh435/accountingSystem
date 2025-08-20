<template>
  <UInputMenu
    v-model="stockSelected"
    value-key="value"
    :items="filteredStockList"
    @input="onSearch"
    placeholder="搜尋 股票代碼或名稱"
    :multiple="props.multipleSelect"
    delete-icon="i-lucide-trash"
    :loading="loading"
    :disabled="props.isDisable" />
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchStockList } from "@/server/outerWebApi";
import { IResponse } from "@/models/index";
import { debounceFn } from "@/composables/tools";
import { showAxiosErrorMsg } from "@/composables/swalDialog";

const props = withDefaults(defineProps<{ multipleSelect?: boolean; isDisable?: boolean }>(), {
  multipleSelect: false,
  isDisable: false,
});
const emits = defineEmits(["sendbackStockNo"]);

const stockSelected = ref<string>("");
const rawStockList = ref<any[]>([]); // Store original API data
const filteredStockList = ref<{ label: string; value: string }[]>([]);
const loading = ref<boolean>(false);

watch(stockSelected, () => {
  // console.log("stockSelected:", stockSelected.value);
  emits("sendbackStockNo", stockSelected.value);
});

function onSearch(event: Event) {
  const target = event.target as HTMLInputElement;
  const keyword = target.value;
  debounceSearchStocks(keyword);
}

const debounceSearchStocks = debounceFn(async (keyword: string) => {
  if (!keyword || keyword.trim().length < 1) {
    filteredStockList.value = [];
    return;
  }

  loading.value = true;
  try {
    const res: IResponse = await fetchStockList(keyword);
    // console.log("res:", JSON.parse(res.data.data));
    if (res.data.returnCode === 0) {
      rawStockList.value = JSON.parse(res.data.data);
      filteredStockList.value = rawStockList.value.map((item: any) => ({
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
});
</script>
