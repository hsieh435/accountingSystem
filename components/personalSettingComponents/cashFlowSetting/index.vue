<template>
  <template v-if="props.cashflowIdIdGot">
    <ui-buttonGroup showView :viewText="'檢視現金流'" @dataView="searchingCashflowData()" :viewDisable="props.isDisable" />
  </template>
  <template v-if="!props.cashflowIdIdGot">
    <ui-buttonGroup showCreate :createText="'新增現金流'" @dataCreate="cashflowDataHandling()" :createDisable="props.isDisable" />
  </template>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, watch, createApp } from "vue";
import { fetchCreateCashFlow } from "@/server/cashFlowApi";
import { ICashFlowList } from "@/models/index";
import { getCurrentYMD, getCurrentTimestamp } from "@/composables/tools";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ cashflowIdIdGot?: string; currencyIdGot: string; isDisable?: boolean }>(), { cashflowIdIdGot: "", currencyIdGot: "", isDisable: false });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<ICashFlowList>({
  cashflowId: props.cashflowIdIdGot || "",
  userId: "",
  currency: props.currencyIdGot,
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  createDate: getCurrentYMD(),
  note: "",
});



onMounted(() => {
  // console.log("onMounted props:", props);
  dataParams.currency = props.currencyIdGot;
});

watch(props, async () => {
  // console.log("watch props:", props);
  dataParams.currency = props.currencyIdGot;
});



async function searchingCashflowData() {
  // cashflowDataHandling();
}



async function cashflowDataHandling(apiMsg?: string) {
  // console.log("dataParams:", dataParams);

  Swal.fire({
    title: props.cashflowIdIdGot ? "修改現金流資料" : "新增現金流資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">現金流貨幣：</span>
          <div id="currencySelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>初始金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="startingAmount" value="${dataParams.startingAmount}" type="number" ${props.cashflowIdIdGot ? "disabled" : ""} />
        </div>


        ${props.cashflowIdIdGot ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">目前金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="presentAmount" value="${dataParams.presentAmount}" type="number" />
        </div>` : 
        ""}


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>最小持有金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="minimumValueAllowed" value="${dataParams.minimumValueAllowed}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>警示金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="alertValue" value="${dataParams.alertValue}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">開啟警示：</span><div class="mx-2" id="switchComponent"></div>
        </div>


        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right my-1">附註：</span>
          <textarea class="${tailwindStyles.inputClasses}" id="note" rows="4" maxlength="500">${dataParams.note}</textarea>
        </div>


        ${props.cashflowIdIdGot ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立時間：</span>
          <input class="${tailwindStyles.inputClasses}" id="createDate" value="${dataParams.createDate}" type="text" disabled />
        </div>` : 
        ""}

      </div>
    `,
    confirmButtonText: props.cashflowIdIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonColor: "#007fff",
    cancelButtonColor: "#ff4337",
    color: "#000",
    background: "#fff",
    allowOutsideClick: false,
    didOpen: () => {

      let currencySelect = createApp(defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue")), {
        currencyIdGot: dataParams.currency,
        sellectAll: false,
        isDisable: true,
      });
      currencySelect.mount("#currencySelectComponent");


      let switchComponent = createApp(defineAsyncComponent(() => import("@/components/ui/switch.vue")), {
        switchValueGot: dataParams.openAlert,
        onSendBackSwitchValue: (switchValue: boolean) => {
          dataParams.openAlert = switchValue;
        },
      });
      switchComponent.mount("#switchComponent");



      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      if (!props.cashflowIdIdGot) {
        dataParams.cashflowId = getCurrentTimestamp() + "";
      }

      dataParams.startingAmount = Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.presentAmount =
        props.cashflowIdIdGot ?
        Number((document.getElementById("presentAmount") as HTMLInputElement).value) :
        Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.minimumValueAllowed = Number((document.getElementById("minimumValueAllowed") as HTMLInputElement).value);
      dataParams.alertValue = Number((document.getElementById("alertValue") as HTMLInputElement).value);
      dataParams.note = (document.getElementById("note") as HTMLTextAreaElement).value;
      // dataParams.createDate = (document.getElementById("createDate") as HTMLInputElement).value;


      if (!dataParams.currency) {
        errors.push("請填寫貨幣");
      }
      if (isNaN(dataParams.startingAmount) || dataParams.startingAmount <= 0) {
        errors.push("請填寫初始金額");
      }
      if (isNaN(dataParams.minimumValueAllowed) || dataParams.minimumValueAllowed < 0) {
        errors.push("請填寫最小持有金額");
      }
      if (isNaN(dataParams.alertValue) || dataParams.alertValue < 0) {
        errors.push("請填寫警示金額");
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
