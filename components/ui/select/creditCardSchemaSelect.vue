<template>
  <UInputMenu v-model="schemaId" value-key="id" :items="items" placeholder="請搜尋" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";




const props = withDefaults(defineProps<{ selectId?: string; selectTitle?: string }>(), { selectId: "", selectTitle: "", });
const emits = defineEmits(["sendbackSchemaId"]);



const schemaId = ref<string>("");
const isSelectDisabled = ref<boolean>(true);



onMounted(async () => {
  if (props.selectId) {
    await searchingAccountLists();
    isSelectDisabled.value = false;
  }
});

watch(schemaId, () => {
  emits("sendbackSchemaId", schemaId.value);
});



async function searchingAccountLists() {
  // 在此加入 API 呼叫與驗證邏輯
};



const items = ref([
  {
    label: "category 1",
    id: "1"
  },
  {
    label: "category 2",
    id: "2"
  },
  {
    label: "category 3",
    id: "3"
  },
  {
    label: "category 4",
    id: "4"
  }
]);
</script>
<style lang="scss" scoped></style>
