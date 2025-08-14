<template>
  <select :class="tailwindStyles.selectClasses" v-model="accountId" :disabled="isDisabled">
    <option v-for="account in accountList" :key="account.value" :value="account.value">
      {{ account.label }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import { fetchCashFlowList } from "@/server/cashFlowApi";
import { fetchCashCardList } from "@/server/cashCardApi";
import { fetchCreditCardList } from "@/server/creditCardApi";
import { fetchCurrencyAccountList } from "@/server/currencyAccountApi";
import { fetchStockAccountList } from "@/server/stockAccountApi";
import { IAccountSearchingParams } from "@/models/index";
import { showAxiosErrorMsg } from "@/composables/swalDialog";
import { tailwindStyles } from "@/assets/css/tailwindStyles";

const props = withDefaults(
  defineProps<{
    selectTargetId: string;
    selectTitle?: string;
    accountIdGot?: string;
    sellectAll?: boolean;
    isDisable?: boolean;
  }>(),
  { selectTargetId: "", selectTitle: "", accountIdGot: "", sellectAll: true, isDisable: false },
);

const emits = defineEmits(["sendbackAccountId"]);

const accountId = ref<string>("");
const accountList = ref<{ label: string; value: string }[]>([]);
const searchParams = reactive<IAccountSearchingParams>({ currencyId: "" });

const isDisabled = computed(() => props.isDisable);

onMounted(async () => {
  // console.log("onMounted props:", props.accountIdGot);
  if (props.selectTargetId) {
    await loadAccountList();
    accountId.value = props.accountIdGot;
  }
});

watch(accountId, () => {
  emits("sendbackAccountId", accountId.value);
});

async function loadAccountList() {
  try {
    const list = await getAccountListByType(props.selectTargetId, searchParams);
    accountList.value = props.sellectAll ? [{ label: "全部", value: "" }, ...list] : list;

    // console.log("list:", list);
    // console.log("accountList:", accountList.value);

  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function getAccountListByType(type: string, params: IAccountSearchingParams) {
  switch (type) {
    case "isCashflowAble": {
      const res = await fetchCashFlowList(params);
      return res.data.data.map((item: any) => ({
        label: item.currencyName + "現金流",
        value: item.cashflowId,
      }));
    }
    case "isCashcardAble": {
      const res = await fetchCashCardList(params);
      return res.data.data.map((item: any) => ({
        label: item.cashcardName,
        value: item.cashcardId,
      }));
    }
    case "isCreditcardAble": {
      const res = await fetchCreditCardList(params);
      return res.data.data.map((item: any) => ({
        label: item.creditcardName,
        value: item.creditcardId,
      }));
    }
    case "isCuaccountAble": {
      const res = await fetchCurrencyAccountList(params);
      return res.data.data.map((item: any) => ({
        label: item.accountName,
        value: item.accountName,
      }));
    }
    case "isStaccountAble": {
      const res = await fetchStockAccountList(params);
      return res.data.data.map((item: any) => ({
        label: item.accountName,
        value: item.accountId,
      }));
    }
    default:
      return [];
  }
}
</script>
<style lang="scss" scoped></style>
