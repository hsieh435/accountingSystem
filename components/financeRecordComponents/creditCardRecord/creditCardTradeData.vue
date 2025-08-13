<template>
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視信用卡花費'" @dataView="searchingCreditCardRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增信用卡花費'" @dataCreate="creditCardRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive, createApp, defineAsyncComponent } from "vue";
import { ICreditCardRecordList } from "@/models/index";
import { getCurrentTimestamp } from "@/composables/tools";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ tradeIdGot?: string; creditCardIdGot: string }>(), { tradeIdGot: "", creditCardIdGot: "" });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<ICreditCardRecordList>({
  tradeId: props.tradeIdGot || "",
  creditCardId: props.creditCardIdGot,
  tradeDatetime: "",
  creditCardUser: "",
  accountType: "",
  tradeCategory: "",
  tradeAmount: 0,
  currency: "TWD",
  billMonth: "",
  tradeDescription: "",
  tradeNote: "",
});



async function searchingCreditCardRecord() {
  // creditCardRecordDataHandling();
}


async function creditCardRecordDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.tradeIdGot ? "編輯現金收支紀錄" : "新增現金收支紀錄",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>信用卡：</span>
          <div id="accountSelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
          <div id="tradeDatetimeComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>收支項目：</span>
          <div id="tradeCategorySelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="tradeAmount" value="${dataParams.tradeAmount}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">說明：</span>
          <input class="${tailwindStyles.inputClasses}" id="tradeDescription" value="${dataParams.tradeDescription}" />
        </div>

        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right my-1">備註：</span>
          <textarea class="${tailwindStyles.inputClasses}" id="tradeNote" rows="4" maxlength="500">${dataParams.tradeNote}</textarea>
        </div>

      </div>
    `,
    confirmButtonText: props.tradeIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    allowOutsideClick: false,
    didOpen: () => {


      let creditCardAccountSelect = createApp(defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue")), {
        selectId: "creditCard",
        selectTitle: "信用卡",
        accountIdGot: props.creditCardIdGot,
        onSendbackAccountId: (accountId: string) => {
          dataParams.creditCardId = accountId;
          // console.log("accountId:", dataParams.creditCardId);
        },
      });
      creditCardAccountSelect.mount("#accountSelectComponent");


      let cashCardTradeDatetime = createApp(defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue")), {
        dateTimeGot: dataParams.tradeDatetime,
        onSendbackDateTime: (dateTime: string) => {
          dataParams.tradeDatetime = dateTime;
        },
      });
      cashCardTradeDatetime.mount("#tradeDatetimeComponent");


      let cashCardTradeCategory = createApp(defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue")), {
        tradeCategoryId: dataParams.tradeCategory,
        onSendbackTradeCategory: (tradeCategoryId: string) => {
          dataParams.tradeCategory = tradeCategoryId;
        },
      });
      cashCardTradeCategory.mount("#tradeCategorySelectComponent");


      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      if (!props.tradeIdGot) {
        dataParams.tradeId = getCurrentTimestamp() + "";
      }
      dataParams.tradeAmount = Number((document.getElementById("tradeAmount") as HTMLInputElement).value);
      dataParams.tradeDescription = (document.getElementById("tradeDescription") as HTMLInputElement).value;
      dataParams.tradeNote = (document.getElementById("tradeNote") as HTMLInputElement).value;


      if (!dataParams.tradeDatetime) {
        errors.push("請填寫交易時間");
      }
      if (!dataParams.tradeCategory) {
        errors.push("請選擇收支項目");
      }
      if (dataParams.tradeAmount < 0) {
        errors.push("交易金額不得為負");
      }

      if (errors.length > 0) {
        Swal.showValidationMessage(errors.map((error, index) => `${index + 1}. ${error}`).join("<br>"));
        return false;
      }

      return dataParams;
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log("result:", result.value);

    }
  });
};


</script>
<style lang="scss" scoped></style>
