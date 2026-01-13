<template>
  <div class="flex-col justify-center items-center w-full">
    <div class="bg-sky-200">
      <!-- <UNavigationMenu :items="navbarMenuList" contentOrientation="vertical" trailingIcon="i-lucide-arrow-down" /> -->

      <nav class="flex border-t shadow-lg relative px-4">
        <ul
          class="flex absolute top-full left-0 relative py-2"
          v-for="(functionGroup, functionGroupIndex) in navbarMenuList"
          :key="functionGroupIndex">
          <li class="w-full relative mx-1 parent">
            <a class="flex justify-between items-center gap-x-2 inline-flex space-x-2 rounded-lg px-3 py-1 hover:bg-gray-50">
              <!-- <font-awesome-icon :icon="functionGroup.icon" />
              <font-awesome-icon :icon="['far', 'user-circle']" /> -->
              <span><label>{{ functionGroup.label }}</label></span>
              <font-awesome-icon :icon="['fas', 'arrow-down']" />
            </a>
            <ul class="bg-white shadow-lg rounded-lg absolute left-0 z-20 transition duration-300 child">
              <li
                class="w-auto rounded-lg mx-2 my-1 p-0 transition duration-300"
                v-for="(functions, functionsIndex) in functionGroup.children"
                :key="functionsIndex">
                <NuxtLink
                  class="w-full flex items-center ps-2 pe-4 py-2 transition duration-300 cursor-pointer hover:bg-zinc-200 rounded-lg"
                  :to="functions.to">
                  <span class="w-full text-nowrap mx-2">{{ functions.label }}</span>
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Nuxt 的 <NuxtLink to="/path"></NuxtLink> 標籤，概念相當於 Vue 的 <RouterLink to="/path"></RouterLink> -->
    <!-- Nuxt 的 <NuxtLayout><NuxtPage></NuxtPage></NuxtLayout> 標籤，概念相當於 Vue 的 <RouterView></RouterView> -->

    <div class="flex justify-between items-center w-full bg-stone-200 px-5 py-1">
      <UBreadcrumb :items="breadcrumbItemList" />
      <UButton class="btn-noshimehana" label="登出" icon="i-lucide-log-out" @click="clearLocalStorageKey(false)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchFunctionList } from "@/server/functionListApi.ts";
import { IResponse, IFunctionGroupList, IFunctionList } from "@/models/index.ts";
import { useRoute } from "vue-router";
import { BreadcrumbItem, NavigationMenuItem } from "@nuxt/ui";
import { clearLocalStorageKey } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";

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
    console.log("navbarMenuList:", navbarMenuList.value);
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
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
<style lang="scss" scoped>
// @media only screen and (min-width: 0px) {
.parent:hover .child {
  height: auto;
  opacity: 1;
  overflow: none;
  transform: translateY(0);
}
.child {
  height: 0;
  opacity: 0;
  overflow: hidden;
  transform: translateY(-10%);
  // background-color: rgb(114, 51, 51);
}
// }
</style>
