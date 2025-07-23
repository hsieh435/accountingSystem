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
import { fetchCashFlowById, fetchCreateCashFlow, fetchUpdateCashFlow } from "@/server/cashFlowApi";
import { ICashFlowList, IResponse } from "@/models/index";
import { getCurrentYMD, getCurrentTimestamp, yearMonthDayTimeFormat } from "@/composables/tools";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ cashflowIdIdGot?: string; currencyIdGot?: string; isDisable?: boolean }>(), { cashflowIdIdGot: "", currencyIdGot: "", isDisable: false });
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
  createdDate: getCurrentYMD(),
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
  // console.log("props:", props);
  try {
    const res = await fetchCashFlowById(props.cashflowIdIdGot) as IResponse;
    console.log("res:", res);
    if (res.data.returnCode === 0) {
      dataParams.cashflowId = res.data.data.cashflowId;
      dataParams.userId = res.data.data.userId;
      dataParams.currency = res.data.data.currency;
      dataParams.startingAmount = res.data.data.startingAmount;
      dataParams.presentAmount = res.data.data.presentAmount;
      dataParams.minimumValueAllowed = res.data.data.minimumValueAllowed;
      dataParams.alertValue = res.data.data.alertValue;
      dataParams.openAlert = res.data.data.openAlert;
      dataParams.createdDate = res.data.data.createdDate;
      dataParams.note = res.data.data.note;

      await cashflowDataHandling();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
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
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>提醒金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="alertValue" value="${dataParams.alertValue}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">開啟提醒：</span><div class="mx-2" id="switchComponent"></div>
        </div>


        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right my-1">附註：</span>
          <textarea class="${tailwindStyles.inputClasses}" id="note" rows="4" maxlength="500">${dataParams.note}</textarea>
        </div>


        ${props.cashflowIdIdGot ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立日期：</span>
          <input class="${tailwindStyles.inputClasses}" value="${yearMonthDayTimeFormat(dataParams.createdDate)}" disabled />
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


      if (!dataParams.currency) {
        errors.push("請填寫貨幣");
      }
      if (isNaN(dataParams.startingAmount) || dataParams.startingAmount < 0) {
        errors.push("請填寫初始金額");
      }
      if (isNaN(dataParams.minimumValueAllowed) || dataParams.minimumValueAllowed < 0) {
        errors.push("請填寫最小持有金額");
      }
      if (isNaN(dataParams.alertValue) || dataParams.alertValue < 0) {
        errors.push("請填寫提醒金額");
      }
      if (errors.length > 0) {
        Swal.showValidationMessage(errors.map((error, index) => `${index + 1}. ${error}`).join("<br>"));
        return false;
      }

      return dataParams;
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      // console.log("result:", result.value);
      try {
        const res = await (props.cashflowIdIdGot ? fetchUpdateCashFlow : fetchCreateCashFlow)(result.value) as IResponse;
        console.log("res:", res);
        if (res.data.returnCode === 0) {
          showAxiosToast({ message: res.data.message });
          emits("dataReseaching");
        } else {
          showAxiosErrorMsg({ message: res.data.message });
        }
      } catch (error) {
        showAxiosErrorMsg({ message: (error as Error).message });
      }
    }
  });
};



</script>
<style lang="scss" scoped></style>
