<template>
  <div class="flex-col justify-start items-center px-10 py-5">
    <UAccordion
      :items="items"
      type="multiple"
      :unmount-on-hide="false"
      trailing-icon="i-lucide-arrow-down">
      <template #body="{ item }"> This is the {{ item.label }} panel. </template>
    </UAccordion>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchStockStorageProfitList } from "@/server/storageProfitApi.ts";
import { IResponse } from "@/models/index";
import { errorMessageDialog } from "@/composables/swalDialog";
import type { AccordionItem } from "@nuxt/ui";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務報表",
  subTitle: "庫存損益",
});

const items = ref<AccordionItem[]>([
  {
    label: "Icons",
    icon: "i-lucide-smile",
    content: "You have nothing to do, @nuxt/icon will handle it automatically.",
  },
  {
    label: "Colors",
    icon: "i-lucide-swatch-book",
    content: "Choose a primary and a neutral color from your Tailwind CSS theme.",
  },
  {
    label: "Components",
    icon: "i-lucide-box",
    content: "You can customize components by using the `class` / `ui` props or in your app.config.ts.",
  },
]);

onMounted(() => {
  // navigateTo("/mainView");
  aaaaaaaaaaaaaa();
});


async function aaaaaaaaaaaaaa() {

  try {
    const res: IResponse = await fetchStockStorageProfitList("20152730138617");
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      //
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}
</script>
<style lang="scss" scoped></style>
