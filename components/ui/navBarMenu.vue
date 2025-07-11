<template>
  <!-- <div class="w-full"> -->
    <UNavigationMenu class="w-full bg-sky-200" :items="items" trailingIcon="i-lucide-arrow-down" contentOrientation="vertical" />
    <!-- Nuxt 的 <NuxtLink to="/path”></NuxtLink> 標籤，概念相當於 Vue 的 <RouterLink to=”/path”></RouterLink> -->
    <!-- Nuxt 的 <NuxtLayout><NuxtPage></NuxtPage></NuxtLayout> 標籤，概念相當於 Vue 的 <RouterView></RouterView> -->
    <UBreadcrumb class="bg-stone-200 px-5 py-2" :items="breadcrumbItemList" />
  <!-- </div> -->
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BreadcrumbItem, NavigationMenuItem } from "@nuxt/ui";



const route = useRoute();
const router = useRouter();



const breadcrumbItemList = ref<BreadcrumbItem[]>([]);



onMounted(() => {
  // console.log("Current route:", route.name);
  // console.log("Current path:", route.path);
  // console.log("route:", route);
  // console.log(route.matched);
  // console.log("router:", router);
  getbreadcrumbItemList();
});

watch(() => route.matched, () => {
  // console.log("Route changed:", route.matched);
  getbreadcrumbItemList();
}, { immediate: true, deep: true });



function getbreadcrumbItemList() {
  breadcrumbItemList.value = [{ label: "首頁", to: "/mainView" }];

  for (let i = 0; i < route.matched.length; i++) {
    if (route.matched[0].name !== "mainView") {
      breadcrumbItemList.value.push({ label: String(route.matched[i].meta.functionTitle || ""), to: "" });
      if (route.matched[i].meta.subTitle) {
        breadcrumbItemList.value.push({ label: String(route.matched[i].meta.subTitle + "" || ""), to: route.path });
      }
    }
  }
}



const items = ref<NavigationMenuItem[]>([
  {
    label: "個人設定",
    icon: "i-lucide-file-text",
    children: [
      {
        label: "使用者資料",
        icon: "i-lucide-file-text",
        to: "/mainView/userSetting",
      },
      {
        label: "現金資料設定",
        icon: "i-lucide-file-text",
        to: "/mainView/cashFlowSetting",
      },
      {
        label: "儲值票卡資料設定",
        icon: "i-lucide-file-text",
        to: "/mainView/creditCardSetting",
      },
      {
        label: "信用卡資料設定",
        icon: "i-lucide-file-text",
        to: "/mainView/cashCardSetting",
      },
      {
        label: "存款帳戶資料設定",
        icon: "i-lucide-file-text",
        to: "/mainView/currencyAccountsSetting",
      },
      {
        label: "證券帳戶資料設定",
        icon: "i-lucide-file-text",
        to: "/mainView/stockAccountSetting",
      }
    ]
  },
  {
    label: "財務收支",
    icon: "i-lucide-file-text",
    children: [
      {
        label: "現金收支",
        icon: "i-lucide-file-text",
        to: "/mainView/cashFlowRecord",
      },
      {
        label: "儲值票卡收支",
        icon: "i-lucide-file-text",
        to: "/mainView/cashCardRecord",
      },
      {
        label: "信用卡收支",
        icon: "i-lucide-file-text",
        to: "/mainView/creditCardRecord",
      },
      {
        label: "存款帳戶收支",
        icon: "i-lucide-file-text",
        to: "/mainView/currencyAccountRecord",
      },
      {
        label: "證券帳戶收支",
        icon: "i-lucide-file-text",
        to: "/mainView/stockAccountRecord",
      }
    ]
  },
  {
    label: "財務報表",
    icon: "i-lucide-file-text",
    children: [
      {
        label: "財務報表",
        icon: "i-lucide-file-text",
        to: "/mainView/financeStatement",
      },
      {
        label: "證券投資報表",
        icon: "i-lucide-file-text",
        to: "/mainView/stockInvestmentStatement",
      },
    ]
  },
  {
    label: "參數設定",
    icon: "i-lucide-file-text",
    children: [
      {
        label: "收支類型設定",
        icon: "i-lucide-file-text",
        to: "/mainView/tradeCategorySetting",
      },
      {
        label: "帳戶類型設定",
        icon: "i-lucide-file-text",
        to: "/mainView/accountTypeSetting",
      },
    ]
  }
])
</script>
