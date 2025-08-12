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



const props = withDefaults(defineProps<{ yearMonthGot?: string }>(), { yearMonthGot: "" });
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
    const [year, month] = props.yearMonthGot.split("-");
    selectedYear.value = parseInt(year);
    selectedMonth.value = parseInt(month);
  }
  emits("sendbackYearMonth", selectedYear.value + "-" + selectedMonth.value.toString().padStart(2, "0"));
});

watch([selectedYear, selectedMonth], () => {
  // console.log(selectedYear.value + "-" + selectedMonth.value.toString().padStart(2, "0"));
  // console.log(selectedYear.value);
  // console.log(selectedMonth.value);
  // console.log(selectedMonth.value.toString().padStart(2, "0"));
  emits("sendbackYearMonth", selectedYear.value + "-" + selectedMonth.value.toString().padStart(2, "0"));
});



</script>
<style lang="scss" scoped></style>
