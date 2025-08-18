<template>
  <UInputMenu
    v-model="stockSelected"
    value-key="value"
    :items="filteredStockList"
    placeholder="搜尋 股票代碼或名稱"
    :multiple="props.sellectAll"
    delete-icon="i-lucide-trash"
    :disabled="props.isDisable" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import { fetchStockList } from "@/server/outSideWebApi";
import { ISelectData, ICurrencyList, IResponse } from "@/models/index";
import { showAxiosErrorMsg } from "@/composables/swalDialog";

const props = withDefaults(defineProps<{ sellectAll?: boolean; isDisable?: boolean }>(), {
  sellectAll: false,
  isDisable: false,
});

const stockSelected = ref<string>("");
const twStockList = ref<{ label: string; value: string }[]>([]);
const filteredStockList = ref<{ label: string; value: string }[]>([]);

onMounted(() => {
  loadingStockList();
});

// watch(stockSelected, () => {
//   filterStocks();
// });

async function loadingStockList() {
  try {
    const res: IResponse = await fetchStockList();
    // console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      twStockList.value = JSON.parse(res.data.data);
      console.log("twStockList:", twStockList.value);

      await filterStocks();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function filterStocks() {
  const keyword = stockSelected.value.trim().toLowerCase();
  setTimeout(() => {
    filteredStockList.value = twStockList.value
      .filter((item: any) => item.Code.toLowerCase().includes(keyword) || item.Name.toLowerCase().includes(keyword))
      .map((item: any) => ({
        label: item.Code + item.Name,
        value: item.Code,
      }));
  }, 10);

  // console.log("filteredStockList:", filteredStockList.value);
}
</script>
