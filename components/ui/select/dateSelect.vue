<template>
  <UInput v-model="dateString" type="date" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getCurrentYMD } from "@/composables/tools"



const props = withDefaults(defineProps<{ dateSelect?: string; }>(), { dateSelect: "", });
const emits = defineEmits(["sendbackDate"]);



const dateString = ref<string>("");



onMounted(async () => {
  console.log("onMounted props:", props);
  dateString.value = props.dateSelect || getCurrentYMD();
});

watch(() => dateString.value, () => {
  emits("sendbackDate", dateString.value);
}, { immediate: true });



</script>
<style lang="scss" scoped></style>
