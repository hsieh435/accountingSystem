<template>
  <div>
    <UNavigationMenu class="w-full justify-start bg-sky-200" :unmount-on-hide="false" :items="items" trailing-icon="i-lucide-arrow-down" content-orientation="vertical" />
  </div>
  <!-- Nuxt的 <NuxtLink to="/path”></NuxtLink>標籤，概念相當於Vue的 <RouterLink to=”/path”></RouterLink>。 -->
  <!-- Nuxt的 <NuxtLayout><NuxtPage></NuxtPage></NuxtLayout>標籤，概念相當於Vue的 <RouterView></RouterView>。 -->
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NavigationMenuItem } from "@nuxt/ui";



// const route = useRoute();
// const router = useRouter();
// console.log("getRoute:", route);
// console.log("getRoutes:", router.getRoutes());



const items = ref<NavigationMenuItem[]>([
  {
    label: "個人設定",
    icon: "i-lucide-file-text",
    children: [
      {
        label: "使用者資料",
        icon: "i-lucide-file-text",
        to: "mainView/userSetting",
      },
      {
        label: "現金資料設定",
        icon: "i-lucide-file-text",
        to: "mainView/cashFlowSetting",
      },
      {
        label: "儲值票卡資料設定",
        icon: "i-lucide-file-text",
        to: "mainView/cashCardSetting",
      },
      {
        label: "信用卡資料設定",
        icon: "i-lucide-file-text",
        to: "mainView/cashCardSetting",
      },
      {
        label: "存款帳戶資料設定",
        icon: "i-lucide-file-text",
        to: "mainView/currencyAccountsSetting",
      },
      {
        label: "證券帳戶資料設定",
        icon: "i-lucide-file-text",
        to: "mainView/stockAccountSetting",
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
        to: "mainView/cashFlowRecord",
      },
      {
        label: "儲值票卡收支",
        icon: "i-lucide-file-text",
        to: "mainView/cashCardRecord",
      },
      {
        label: "信用卡收支",
        icon: "i-lucide-file-text",
        to: "mainView/creditCardRecord",
      },
      {
        label: "存款帳戶收支",
        icon: "i-lucide-file-text",
        to: "mainView/currencyAccountRecord",
      },
      {
        label: "證券帳戶收支",
        icon: "i-lucide-file-text",
        to: "mainView/stockAccountRecord",
      }
    ]
  },
  {
    label: "財務報表",
    icon: "i-lucide-file-text",
    // active: true,
    children: [
      {
        label: "財務報表",
        icon: "i-lucide-file-text",
        to: "mainView/financeStatement",
      },
      {
        label: "證券投資報表",
        icon: "i-lucide-file-text",
        to: "mainView/stockInvestmentStatement",
      },
    ]
  },
  {
    label: "參數設定",
    icon: "i-lucide-file-text",
    // active: true,
    children: [
      {
        label: "收支類型設定",
        icon: "i-lucide-file-text",
        to: "mainView/tradeCategorySetting",
      },
      {
        label: "帳戶類型設定",
        icon: "i-lucide-file-text",
        to: "mainView/accountTypeSetting",
      },
    ]
  }
])
</script>
