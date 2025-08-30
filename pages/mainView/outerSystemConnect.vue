<template>
  <div class="flex-col justify-start items-center">
    <div class="flex justify-start items-center my-1 px-3">
      <UInput class="mx-1" v-model="finMindAccount" placeholder="請輸入帳號" type="search" />
      <UInput class="mx-1" v-model="finMindPassword" placeholder="請輸入密碼" type="password" />
      <ui-buttonGroup showSearch :searchText="'連線'" @dataSearch="handleSearch"></ui-buttonGroup>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
// import { testConnection } from "@/server/outerWebApi";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "連線測試",
});



const finMindAccount = ref<string>("");
const finMindPassword = ref<string>("");



async function handleSearch() {
  //

}
</script>
<style lang="scss" scoped></style>
