<template>
  <UBreadcrumb class="bg-stone-200 px-5 py-2" :items="breadcrumbItemList" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { BreadcrumbItem } from "@nuxt/ui";
import { useRoute, useRouter } from "vue-router";
// import { useRouter } from "#app"



const breadcrumbItemList = ref<BreadcrumbItem[]>([]);



const route = useRoute();
const router = useRouter();

onMounted(() => {
  // console.log("Current route:", route.name);
  // console.log("Current path:", route.path);
  console.log("route:", route);
  console.log(route.matched);
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

</script>
