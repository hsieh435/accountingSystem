<template>
  <div class="flex-col justify-start items-center">
    <div class="flex justify-start items-center my-1 px-3">
      <UInput class="mx-1" v-model="finMindAccount" placeholder="請輸入帳號" type="search" v-on:keyup.enter="handleSearch" />
      <UInput class="mx-1" v-model="finMindPassword" placeholder="請輸入密碼" type="password" v-on:keyup.enter="handleSearch" />
      <ui-buttonGroup showSearch :searchText="'連線 FinMind'" @dataSearch="handleSearch"></ui-buttonGroup>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { fetchTestConnection } from "@/server/outerWebApi";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "連線測試",
});

const finMindAccount = ref<string>("");
const finMindPassword = ref<string>("");

async function handleSearch() {
  try {
    const result = await fetchTestConnection({
      user_id: finMindAccount.value,
      password: finMindPassword.value,
    });
    console.log("result:", result);
    if (result.data.data.status === 200) {
      messageToast({ message: "連線成功" });
    } else {
      errorMessageDialog({ message: result.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
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
</script>
<style lang="scss" scoped></style>
