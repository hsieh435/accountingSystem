<template>
  <div class="flex-col justify-start items-center px-3 py-1">
    <div class="flex justify-start items-center gap-1">
      <UInput v-model="finMindAccount" placeholder="請輸入帳號" type="search" v-on:keyup.enter="connectingFinMind" />
      <UInput v-model="finMindPassword" placeholder="請輸入密碼" type="password" v-on:keyup.enter="connectingFinMind" />
      <ui-buttonGroup showSearch :searchText="'連線 FinMind'" @dataSearch="connectingFinMind"></ui-buttonGroup>
      <ui-buttonGroup showSearch :searchText="'Token 狀態'" @dataSearch="checkFinMindTokenStatus"></ui-buttonGroup>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { fetchFinMindTestConnection, fetchFinMindAccountInfo } from "@/server/outerWebApi";
import { IResponse } from "@/models/index";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "連線測試",
});

const finMindAccount = ref<string>("");
const finMindPassword = ref<string>("");

async function connectingFinMind() {
  try {
    const result: IResponse = await fetchFinMindTestConnection({
      user_id: finMindAccount.value.trim(),
      password: finMindPassword.value.trim(),
    });
    console.log("result:", result);
    if (result.data.data.status === 200) {
      messageToast({ message: "連線成功" });
    } else {
      errorMessageDialog({ message: result.data.message });
    }
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
  // console.log("Request Body:", JSON.stringify(payload));

  // try {
  //   const result = await fetch("https://api.finmindtrade.com/api/v4/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ user_id, password }),
  //   });
  //   const jsonData = await result.json();
  //   console.log("result:", result);
  //   console.log("jsonData:", jsonData);
  //   res.json(success({ data: jsonData, message: "查詢成功", req, res }));
  // } catch (err) {
  //   res.status(500).json(error({ message: "查詢失敗", req, res }));
  // }
}

async function checkFinMindTokenStatus() {
  try {
    const res: IResponse = await fetchFinMindAccountInfo();
    console.log("fetchFinMindAccountInfo:", res);
    if (res.data.returnCode === 0) {
      messageToast({ message: "Token 有效" });
    }
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
