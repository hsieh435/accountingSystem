<template>
  <template v-if="props.cashCardIdGot">
    <ui-buttonGroup showView :viewText="'檢視儲值票卡'" @dataView="searchingCashCardData()" />
    <ui-buttonGroup showRemove :createText="'刪除儲值票卡'" @dataRemove="removeCashCardData()" />
  </template>
  <template v-if="!props.cashCardIdGot">
    <ui-buttonGroup showCreate :createText="'新增儲值票卡'" @dataCreate="cashCardDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive, createApp, defineAsyncComponent } from "vue";
import { fetchCashCardById, fetchCashCardCreate, fetchCashCardUpdate, fetchCashCardDelete } from "@/server/cashCardApi";
import { ICashCardList, IResponse } from "@/models/index";
import { yearMonthDayTimeFormat } from "@/composables/tools";
import { showAxiosToast, showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";

const props = withDefaults(defineProps<{ cashCardIdGot?: string }>(), { cashCardIdGot: "" });
const emits = defineEmits(["dataReseaching"]);

const dataParams = reactive<ICashCardList>({
  cashcardId: props.cashCardIdGot || "",
  userId: "",
  accountType: "cashCard",
  cashcardName: "",
  currency: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  maximumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: true,
  createdDate: "",
  note: "",
});

async function searchingCashCardData() {
  // console.log("props:", props);
  try {
    const res: IResponse = await fetchCashCardById(props.cashCardIdGot);
    // console.log("fetchCashCardById:", res.data.data);
    if (res.data.returnCode === 0) {
      dataParams.cashcardId = res.data.data.cashcardId;
      dataParams.userId = res.data.data.userId;
      dataParams.cashcardName = res.data.data.cashcardName;
      dataParams.currency = res.data.data.currency;
      dataParams.startingAmount = res.data.data.startingAmount;
      dataParams.presentAmount = res.data.data.presentAmount;
      dataParams.minimumValueAllowed = res.data.data.minimumValueAllowed;
      dataParams.alertValue = res.data.data.alertValue;
      dataParams.openAlert = res.data.data.openAlert;
      dataParams.createdDate = res.data.data.createdDate;
      dataParams.note = res.data.data.note;

      await cashCardDataHandling();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function cashCardDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.cashCardIdGot ? "修改儲值票卡資料" : "新增儲值票卡資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">儲值票卡名稱：</span>
          <input class="${tailwindStyles.inputClasses}" id="cashcardName" value="${dataParams.cashcardName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">結算貨幣：</span>
          <div id="currencySelectComponent"></div>
        </div>


        ${
          props.cashCardIdGot
            ? `<div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">目前金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="presentAmount" value="${dataParams.presentAmount}" type="number" disabled />
        </div>`
            : `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">初始金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="startingAmount" value="${dataParams.startingAmount}" type="number" ${props.cashCardIdGot ? "disabled" : ""} />
        </div>`
        }


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">最小儲值金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="minimumValueAllowed" value="${dataParams.minimumValueAllowed}" type="number" />
        </div>

        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">最大儲值金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="maximumValueAllowed" value="${dataParams.maximumValueAllowed}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">提醒金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="alertValue" value="${dataParams.alertValue}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">提醒：</span>
          <div class="flex justify-start items-center">
            <div id="switchComponent"></div>
          </div>
        </div>


        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right my-1">附註：</span>
          <textarea class="${tailwindStyles.inputClasses}" id="note" rows="6">${dataParams.note}</textarea>
        </div>


        ${
          props.cashCardIdGot
            ? `
          <div class="flex justify-start items-center grid grid-cols-6 my-2">
            <span class="col-start-1 col-end-3 text-right">建立時間：</span>
            <input class="${tailwindStyles.inputClasses}" id="createdDate" value="${yearMonthDayTimeFormat(dataParams.createdDate)}" disabled />
          </div>`
            : ""
        }

      </div>
    `,
    confirmButtonText: props.cashCardIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    allowOutsideClick: false,
    didOpen: () => {
      let currencySelect = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue")),
        {
          currencyIdGot: dataParams.currency || "",
          sellectAll: false,
          isDisable: props.cashCardIdGot ? true : false,
          onSendbackCurrencyId: (currencyId: string) => {
            dataParams.currency = currencyId;
          },
        },
      );
      currencySelect.mount("#currencySelectComponent");

      // const startingAmount = document.getElementById("startingAmount") as HTMLInputElement;
      const minimumValueAllowed = document.getElementById("minimumValueAllowed") as HTMLInputElement;
      const maximumValueAllowed = document.getElementById("maximumValueAllowed") as HTMLInputElement;
      const alertValue = document.getElementById("alertValue") as HTMLInputElement;
      minimumValueAllowed.addEventListener("change", () => {
        validateAlertValue();
      });
      maximumValueAllowed.addEventListener("change", () => {
        validateAlertValue();
      });
      alertValue.addEventListener("change", () => {
        validateAlertValue();
      });

      function validateAlertValue() {
        // console.log("minimumValueAllowed:", minimumValueAllowed.value);
        // console.log("maximumValueAllowed:", maximumValueAllowed.value);
        // console.log("alertValue:", alertValue.value);

        maximumValueAllowed.min = minimumValueAllowed.value;
        minimumValueAllowed.max = maximumValueAllowed.value;
        // startingAmount.max = maximumValueAllowed.value;
        // startingAmount.min = minimumValueAllowed.value;
        alertValue.max = maximumValueAllowed.value;
        alertValue.min = minimumValueAllowed.value;

        if (Number(alertValue.value) < Number(minimumValueAllowed.value)) {
          alertValue.value = minimumValueAllowed.value;
        }
        if (Number(alertValue.value) > Number(maximumValueAllowed.value)) {
          alertValue.value = maximumValueAllowed.value;
        }
        if (Number(minimumValueAllowed.value) > Number(maximumValueAllowed.value)) {
          minimumValueAllowed.value = maximumValueAllowed.value;
        }
        if (Number(maximumValueAllowed.value) < Number(minimumValueAllowed.value)) {
          maximumValueAllowed.value = minimumValueAllowed.value;
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

      dataParams.cashcardName = (document.getElementById("cashcardName") as HTMLInputElement).value;
      if (!dataParams.cashcardId) {
        dataParams.startingAmount = Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      }
      dataParams.presentAmount = props.cashCardIdGot
        ? Number((document.getElementById("presentAmount") as HTMLInputElement).value)
        : Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.minimumValueAllowed = Number(
        (document.getElementById("minimumValueAllowed") as HTMLInputElement).value,
      );
      dataParams.maximumValueAllowed = Number(
        (document.getElementById("maximumValueAllowed") as HTMLInputElement).value,
      );
      dataParams.alertValue = Number((document.getElementById("alertValue") as HTMLInputElement).value);
      dataParams.note = (document.getElementById("note") as HTMLTextAreaElement).value;

      if (!dataParams.cashcardName) {
        errors.push("請填寫儲值票卡名稱");
      }
      if (!dataParams.currency) {
        errors.push("請填寫票卡結算貨幣");
      }
      if (isNaN(dataParams.startingAmount)) {
        errors.push("請填寫儲值票卡初始金額");
      }
      if (isNaN(dataParams.minimumValueAllowed)) {
        errors.push("請填寫儲值票卡最小儲值金額");
      }
      if (isNaN(dataParams.maximumValueAllowed)) {
        errors.push("請填寫儲值票卡最大儲值金額");
      }
      if (dataParams.maximumValueAllowed <= dataParams.minimumValueAllowed) {
        errors.push("儲值票卡最小儲值金額必須小於最大儲值金額");
      }
      if (isNaN(dataParams.alertValue) || dataParams.alertValue < 0) {
        errors.push("請填寫提醒金額");
      }
      if (
        dataParams.alertValue < dataParams.minimumValueAllowed ||
        dataParams.alertValue > dataParams.maximumValueAllowed
      ) {
        errors.push("提醒金額需介於最小儲值金額與最大儲值金額之間");
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
        const res: IResponse = await (props.cashCardIdGot ? fetchCashCardUpdate : fetchCashCardCreate)(result.value);
        // console.log("RES:", res);
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
}

async function removeCashCardData() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除儲值票卡資料與相關收支紀錄",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchCashCardDelete,
    apiParams: props.cashCardIdGot,
  });

  if (confirmResult) {
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
