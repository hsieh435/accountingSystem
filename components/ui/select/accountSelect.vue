<template>
  <div class="flex justify-start items-center">
    <select :class="tailwindStyles.selectClasses" v-model="accountId">
      <option v-for="account in accountArray" :key="account.value" :value="account.value">
        {{ account.label }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



const props = withDefaults(defineProps<{ selectTargetId?: string; selectTitle?: string; accountIdGot?: string; sellectAll?: boolean; isDisable?: boolean }>(), { selectTargetId: "", selectTitle: "", accountIdGot: "", sellectAll: true, isDisable: false });
const emits = defineEmits(["sendbackAccountId"]);



const accountId = ref<string>("");
const isSelectDisabled = ref<boolean>(false);
const accountArray = ref<{ label: string; value: string; }[]>([]);



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


  // .map
  accountArray.value = [
    { label: "account 1", value: "1" },
    { label: "account 2", value: "2" },
    { label: "account 3", value: "3" },
    { label: "account 4", value: "4" }
  ];

  if (props.sellectAll) {
    accountArray.value.unshift({ label: "所有帳戶", value: "" });
  }

};



</script>
<style lang="scss" scoped></style>
