<template>
  <div class="flex justify-start items-center">
    <select :class="tailwindStyles.selectClasses" v-model="tradeCategoryId">
      <option v-for="category in tradeCategoryArray" :key="category.value" :value="category.value">
        {{ category.label }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



const props = withDefaults(defineProps<{ tradeCategoryGot?: string; sellectAll?: boolean }>(), { tradeCategoryGot: "", sellectAll: true });
const emits = defineEmits(["sendbackTradeCategory"]);



const tradeCategoryId = ref<string>("");
const tradeCategoryArray = ref<{ label: string; value: string; }[]>([]);



onMounted(async () => {
  tradeCategoryId.value = props.tradeCategoryGot || "";
  await searchingTradeType();
});

watch(tradeCategoryId, () => {
  // console.log("tradeCategoryId:", tradeCategoryId.value);
  emits("sendbackTradeCategory", tradeCategoryId.value);
});





async function searchingTradeType() {
  

  // .map
  tradeCategoryArray.value = [
    { label: "category 1", value: "1" },
    { label: "category 2", value: "2" },
    { label: "category 3", value: "3" },
    { label: "category 4", value: "4" }
  ];

  if (props.sellectAll) {
    tradeCategoryArray.value.unshift({ label: "所有項目", value: "" });
  }

};



</script>
<style lang="scss" scoped></style>
