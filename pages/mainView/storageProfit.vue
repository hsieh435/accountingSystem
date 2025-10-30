<template>
  <div class="flex-col justify-start items-center">
    <UAccordion
      :ui="{ label: 'mx-5', trailingIcon: 'mx-5', body: 'mx-5' }"
      :items="accordionItems"
      type="multiple"
      :unmount-on-hide="false"
      trailing-icon="i-lucide-arrow-down">
      <template #body="{ item }">
        <span>明細</span>
      </template>
    </UAccordion>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchStockStorageProfitList } from "@/server/storageProfitApi.ts";
import { IStockStorageList, IResponse } from "@/models/index";
import { errorMessageDialog } from "@/composables/swalDialog";
import type { AccordionItem } from "@nuxt/ui";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務報表",
  subTitle: "庫存損益",
});

const accordionItems = ref<AccordionItem[]>([]);

onMounted(() => {
  searchingStockStorage();
});


async function searchingStockStorage() {

  try {
    const res: IResponse = await fetchStockStorageProfitList("20152730138617");
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      accordionItems.value = res.data.data.map((item: IStockStorageList) => ({
        label: `${item.stockNo} / ${item.stockName}`,
        // content: item.content,
      }));
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}
</script>
<style lang="scss" scoped></style>
