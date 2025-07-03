<template>
  <UInput v-model="dateString" type="date" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getCurrentYMD } from "@/composables/tools"



const props = withDefaults(defineProps<{ dateSelect?: string; hasDefault?: boolean }>(), { dateSelect: "", hasDefault: false });
const emits = defineEmits(["sendbackDate"]);



const dateString = ref<string>("");



onMounted(async () => {
  dateString.value = props.hasDefault === true ? props.dateSelect || "" : getCurrentYMD();
});




</script>
<style lang="scss" scoped></style>
