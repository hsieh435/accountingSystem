<template>
  <div class="flex justify-start items-center">
    <select :class="tailwindStyles.selectClasses" v-model="schemaId" :disabled="props.isAble">
      <option v-for="schema in schemaArray" :key="schema.value" :value="schema.value">{{ schema.label }}</option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



const props = withDefaults(defineProps<{ selectId?: string; sellectAll?: boolean; isAble?: boolean }>(), { selectId: "", sellectAll: true, isAble: false });
const emits = defineEmits(["sendbackSchemaId"]);



const schemaId = ref<string>("");
const isSelectDisabled = ref<boolean>(true);
const schemaArray = ref<{ label: string; value: string; }[]>([]);



onMounted(async () => {
  if (props.selectId) {
    await searchingSchemaList();
    isSelectDisabled.value = false;
  }
});

watch(schemaId, () => {
  emits("sendbackSchemaId", schemaId.value);
});



async function searchingSchemaList() {

  // .map
  schemaArray.value = [
    { label: "category 1", value: "1" },
    { label: "category 2", value: "2" },
    { label: "category 3", value: "3" },
    { label: "category 4", value: "4" }
  ];

  if (props.sellectAll) {
    schemaArray.value.unshift({ label: "所有發卡機構", value: "" });
  }

};
</script>
<style lang="scss" scoped></style>
