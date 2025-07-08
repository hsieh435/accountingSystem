<template>  
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視現金收支'" @dataView="searchingCashFlowRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增現金收支'" @dataCreate="cashFlowRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive, createApp, defineAsyncComponent } from "vue";
import { ICashFlowRecordList } from "@/models/index";
import { getCurrentTimestamp } from "@/composables/tools";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ tradeIdGot?: string; }>(), { tradeIdGot: "", });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<ICashFlowRecordList>({
  tradeId: props.tradeIdGot || "",
  userId: "",
  tradeDatetime: "",
  accountType: "",
  incomingOutgoing: "",
  tradeCategory: "",
  tradeAmount: 0,
  tradeDescription: "",
  tradeNote: "",
});



async function searchingCashFlowRecord() {
  // cashFlowRecordDataHandling();  
}


async function cashFlowRecordDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.tradeIdGot ? "編輯現金收支紀錄" : "新增現金收支紀錄",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易日期：</span>
          <div id="tradeDatetimeComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>收支：</span>
          <div class="col-span-4" id="incomeOutgoSelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>收支項目：</span>
          <div id="tradeCategorySelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易金額：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="tradeAmount" value="${dataParams.tradeAmount}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">說明：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="tradeDescription" value="${dataParams.tradeDescription}" />
        </div>

        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right my-1">備註：</span>
          <textarea class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="tradeNote" rows="4" maxlength="500" ${dataParams.tradeNote}></textarea>
        </div>

      </div>
    `,
    confirmButtonText: props.tradeIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonColor: "#007fff",
    cancelButtonColor: "#ff4337",
    color: "#000",
    background: "#fff",
    allowOutsideClick: false,
    didOpen: () => {


      // 初始化日期時間選擇器      
      let cashCardTradeDatetime = createApp(defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue")), {
        dateTimeGot: dataParams.tradeDatetime,
        onSendbackDateTime: (dateTime: string) => {
          dataParams.tradeDatetime = dateTime;
        },
      });
      cashCardTradeDatetime.mount("#tradeDatetimeComponent");


      // 初始化收支選擇器
      let cashCardIncomeOutgo = createApp(defineAsyncComponent(() => import("@/components/ui/select/incomeOutgoSelect.vue")), {
        tradeCategoryGot: dataParams.incomingOutgoing,
        onSendbackIncomeExpense: (type: string) => {
          dataParams.incomingOutgoing = type;
        },
      });
      cashCardIncomeOutgo.mount("#incomeOutgoSelectComponent");


      // 初始化收支項目選擇器
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
        errors.push("請填寫交易日期");
      }

      if (!dataParams.incomingOutgoing) {
        errors.push("請選擇收支");
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

      return { dataParams };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log("result:", result);

    }
  });
};


</script>
<style lang="scss" scoped></style>
