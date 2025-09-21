<template>
  <template v-if="props.cashflowIdIdGot">
    <ui-buttonGroup showView :viewText="'檢視現金流'" @dataView="searchingCashflowData()" />
    <ui-buttonGroup showRemove :removeText="'刪除現金流'" @dataRemove="removeCashFlowData()" />
  </template>
  <template v-if="!props.cashflowIdIdGot">
    <ui-buttonGroup showCreate :createText="'新增現金流'" @dataCreate="cashflowDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, createApp } from "vue";
import { fetchCashFlowById, fetchCashFlowCreate, fetchCashFlowUpdate, fetchCashFlowDelete } from "@/server/cashFlowApi";
import { ICashFlowList, IResponse } from "@/models/index";
import { yearMonthDayTimeFormat } from "@/composables/tools";
import { showAxiosToast, showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";

const props = withDefaults(defineProps<{ cashflowIdIdGot?: string; isDisable?: boolean }>(), {
  cashflowIdIdGot: "",
  isDisable: false,
});
const emits = defineEmits(["dataReseaching"]);

const getDefaultDataParams = (): ICashFlowList => ({
  cashflowId: props.cashflowIdIdGot || "",
  userId: "",
  accountType: "cashFlow",
  cashflowName: "",
  currency: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: true,
  createdDate: "",
  note: "",
});
const dataParams = reactive<ICashFlowList>(getDefaultDataParams());

async function searchingCashflowData() {
  // console.log("props:", props);
  try {
    const res: IResponse = await fetchCashFlowById(props.cashflowIdIdGot);
    if (res.data.returnCode === 0) {
      dataParams.cashflowId = res.data.data.cashflowId;
      dataParams.userId = res.data.data.userId;
      dataParams.cashflowName = res.data.data.cashflowName;
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
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>現金流名稱：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="cashflowName" value="${dataParams.cashflowName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">現金流貨幣：</span>
          <div id="dataBaseCurrencySelectComponent"></div>
        </div>


        ${
          props.cashflowIdIdGot
            ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">目前金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="presentAmount" value="${dataParams.presentAmount}" type="number" disabled />
        </div>`
            : `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>初始金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="startingAmount" value="${dataParams.startingAmount}" type="number" />
        </div>`
        }


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>最小持有金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="minimumValueAllowed" value="${dataParams.minimumValueAllowed}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>提醒金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="alertValue" value="${dataParams.alertValue}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">提醒：</span>
          <div class="flex justify-start items-center">
            <div id="switchComponent"></div>
          </div>
        </div>


        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right my-1">附註：</span>
          <textarea class="${tailwindStyles.getInputClasses()}" id="note" rows="6">${dataParams.note}</textarea>
        </div>


        ${
          props.cashflowIdIdGot
            ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立日期：</span>
          <input class="${tailwindStyles.getInputClasses()}" value="${yearMonthDayTimeFormat(dataParams.createdDate)}" disabled />
        </div>`
            : ""
        }

      </div>
    `,
    confirmButtonText: props.cashflowIdIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    allowOutsideClick: false,
    didOpen: () => {
      let dataBaseCurrencySelect = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue")),
        {
          currencyIdGot: dataParams.currency,
          isDisable: props.cashflowIdIdGot ? true : false,
          onSendbackCurrencyId: (currencyId: string) => {
            dataParams.currency = currencyId;
          },
        },
      );
      dataBaseCurrencySelect.mount("#dataBaseCurrencySelectComponent");

      const minimumValueAllowed = document.getElementById("minimumValueAllowed") as HTMLInputElement;
      const alertValue = document.getElementById("alertValue") as HTMLInputElement;
      minimumValueAllowed.addEventListener("change", () => {
        validateAlertValue();
      });
      alertValue.addEventListener("change", () => {
        validateAlertValue();
      });

      function validateAlertValue() {
        // console.log("minimumValueAllowed:", minimumValueAllowed.value);
        // console.log("alertValue:", alertValue.value);
        alertValue.min = minimumValueAllowed.value;

        if (Number(alertValue.value) < Number(minimumValueAllowed.value)) {
          alertValue.value = minimumValueAllowed.value;
        }
      }

      let switchComponent = createApp(
        defineAsyncComponent(() => import("@/components/ui/switch.vue")),
        {
          switchValueGot: dataParams.openAlert,
          onSendBackSwitchValue: (switchValue: boolean) => {
            dataParams.openAlert = switchValue;
          },
        },
      );
      switchComponent.mount("#switchComponent");

      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      if (!props.cashflowIdIdGot) {
        dataParams.startingAmount = Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      }
      dataParams.cashflowName = (document.getElementById("cashflowName") as HTMLInputElement).value;
      dataParams.presentAmount = props.cashflowIdIdGot
        ? Number((document.getElementById("presentAmount") as HTMLInputElement).value)
        : Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.minimumValueAllowed = Number(
        (document.getElementById("minimumValueAllowed") as HTMLInputElement).value,
      );
      dataParams.alertValue = Number((document.getElementById("alertValue") as HTMLInputElement).value);
      dataParams.note = (document.getElementById("note") as HTMLTextAreaElement).value;

      if (!dataParams.cashflowName) {
        errors.push("請填寫現金流名稱");
      }
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
      if (dataParams.alertValue < dataParams.minimumValueAllowed) {
        errors.push("提醒金額不得低於最小持有金額");
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
      try {
        const res: IResponse = await (props.cashflowIdIdGot ? fetchCashFlowUpdate : fetchCashFlowCreate)(result.value);
        // console.log("RES:", res);
        if (res.data.returnCode === 0) {
          showAxiosToast({ message: res.data.message });
          emits("dataReseaching");
          Object.assign(dataParams, getDefaultDataParams());
        } else {
          showAxiosErrorMsg({ message: res.data.message });
        }
      } catch (error) {
        showAxiosErrorMsg({ message: (error as Error).message });
      }
    }
  });
}

async function removeCashFlowData() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除現金流資料",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchCashFlowDelete,
    apiParams: props.cashflowIdIdGot,
  });

  if (confirmResult) {
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
