<template>
  <UInput v-model="dateString" type="datetime-local" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getCurrentTimestamp, yearMonthDayTimeFormat} from "@/composables/tools";



const props = withDefaults(defineProps<{ dateTimeGot?: string; }>(), { dateTimeGot: "", });
const emits = defineEmits(["sendbackDateTime"]);



const dateString = ref<string>("");



onMounted(async () => {
  dateString.value = props.dateTimeGot || yearMonthDayTimeFormat(getCurrentTimestamp(), true);  
  // console.log("dateString:", dateString.value);
});

watch(() => dateString.value, () => {
  emits("sendbackDateTime", dateString.value);
}, { immediate: true });



</script>
<style lang="scss" scoped></style>
