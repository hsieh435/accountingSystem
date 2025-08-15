<template>
  <URadioGroup orientation="horizontal" color="neutral" variant="list" :items="items" v-model="incomeExpenseValue" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { RadioGroupItem, RadioGroupValue } from "@nuxt/ui"



const props = withDefaults(defineProps<{ incomeExpense?: string; }>(), { incomeExpense: "", });
const emits = defineEmits(["sendbackIncomeExpense"]);



const items = ref<RadioGroupItem[]>([
  { label: "收入", value: "income" },
  { label: "支出", value: "expense" },
]);



const incomeExpenseValue = ref<RadioGroupValue>("");



onMounted(() => {
  incomeExpenseValue.value = props.incomeExpense || "";
});

watch(incomeExpenseValue, () => {
//   console.log("Selected value:", incomeExpenseValue.value);
  emits("sendbackIncomeExpense", incomeExpenseValue.value);
}, { immediate: true });



</script>
<style lang="scss" scoped></style>
