<template>
  <div class="flex-col justify-center items-center w-full">
    <div class="w-full bg-sky-200">
      <UNavigationMenu :items="navbarMenuList" trailingIcon="i-lucide-arrow-down" contentOrientation="vertical" />
    </div>

    <!-- Nuxt 的 <NuxtLink to="/path"></NuxtLink> 標籤，概念相當於 Vue 的 <RouterLink to="/path"></RouterLink> -->
    <!-- Nuxt 的 <NuxtLayout><NuxtPage></NuxtPage></NuxtLayout> 標籤，概念相當於 Vue 的 <RouterView></RouterView> -->

    <div class="flex justify-between items-center w-full bg-stone-200 px-5 py-1">
      <UBreadcrumb :items="breadcrumbItemList" />
      <button class="btn-noshimehana" @click="clearLocalStorageKey(false)" type="button">
        <span class="mx-2">登出</span><font-awesome-icon class="mx-1" :icon="['fas', 'sign-out-alt']" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchFunctionList } from "@/server/functionAPI";
import { IResponse, IFunctionGroupList, IFunctionList } from "@/models/index";
import { useRoute } from "vue-router";
import { BreadcrumbItem, NavigationMenuItem } from "@nuxt/ui";
import { clearLocalStorageKey } from "@/composables/tools";
import { errorMessageDialog } from "@/composables/swalDialog";

const route = useRoute();

const navbarMenuList = ref<NavigationMenuItem[]>([]);
const breadcrumbItemList = ref<BreadcrumbItem[]>([]);

onMounted(() => {
  // console.log("Current route:", route.name);
  // console.log("Current path:", route.path);
  // console.log("route:", route);
  // console.log(route.matched);
  // console.log("router:", router);
  searchingFunctionList();
  getbreadcrumbItemList();
});

watch(route, () => {
  // console.log("route:", route);
  getbreadcrumbItemList();
});

async function searchingFunctionList() {
  try {
    const res: IResponse = await fetchFunctionList();
    // console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      navbarMenuList.value = res.data.data.map((group: IFunctionGroupList) => {
        const functions = group.functionList
          .filter((func: IFunctionList) => func.functionGroupId === group.functionGroupId)
          .map((func: IFunctionList) => ({
            label: func.functionName,
            to: func.url,
            icon: func.functionIcon,
          }));
        return {
          label: group.functionGroupName,
          functionGroupId: group.functionGroupId,
          icon: group.functionGroupIcon,
          children: functions,
        };
      });
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

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
</script>
<style lang="scss" scoped></style>
