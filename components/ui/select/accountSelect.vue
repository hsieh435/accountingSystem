<template>
  <UInputMenu v-model="accountId" value-key="id" :items="items" placeholder="請搜尋" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";



const props = withDefaults(defineProps<{ selectTargetId?: string; selectTitle?: string; accountIdGot?: string; isDisable?: boolean }>(), { selectTargetId: "", selectTitle: "", accountIdGot: "", isDisable: false });
const emits = defineEmits(["sendbackAccountId"]);



const accountId = ref<string>("");
const isSelectDisabled = ref<boolean>(false);



onMounted(async () => {
  if (props.selectTargetId) {
    await searchingAccountLists();
    isSelectDisabled.value = props.isDisable;
    accountId.value = props.accountIdGot;
  }
});

watch(accountId, () => {
  console.log("accountId:", accountId.value);
  emits("sendbackAccountId", accountId.value);
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
