<template>
  <div class="flex gap-4 items-center">
    <select :class="tailwindStyles.selectClasses" v-model="selectedYear">
      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
    </select>

    <select :class="tailwindStyles.selectClasses" v-model="selectedMonth">
      <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getCurrentYear, getCurrentMonth } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



const props = withDefaults(defineProps<{ yearMonthGot?: string; max?: string; min?: string }>(), { yearMonthGot: "", max: "", min: "" });
const emits = defineEmits(["sendbackYearMonth"]);



const selectedYear = ref<number>(getCurrentYear());
const selectedMonth = ref<number>(getCurrentMonth());



const years = Array.from({ length: 20 }, (_, i) => (getCurrentYear() + 10) - i);
const months = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} 月`,
  value: i + 1,
}));



onMounted(() => {
  if (props.yearMonthGot) {
    const date = new Date(props.yearMonthGot);
    selectedYear.value = date.getFullYear();
    selectedMonth.value = date.getMonth() + 1;
  }
  emits("sendbackYearMonth", selectedYear.value, selectedMonth.value);
});

watch([selectedYear, selectedMonth], () => {
  emits("sendbackYearMonth", selectedYear.value, selectedMonth.value);
});



</script>
<style lang="scss" scoped></style>
