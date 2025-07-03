<template>
  <UBreadcrumb class="bg-stone-200 px-5 py-2" :items="items" />
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { BreadcrumbItem } from "@nuxt/ui";
import { useRoute, useRouter } from "vue-router";
// import { useRouter } from "#app"



const items = ref<BreadcrumbItem[]>([{ label: "首頁", to: "/mainView" }]);




onMounted(() => {
  const route = useRoute();
  const router = useRouter();

  // console.log("Current route:", route.name);
  // console.log("Current path:", route.path);
  console.log("route:", route);
  console.log(route.matched);
  // console.log("router:", router);

  if (route.matched[0].name !== "mainView") {
    items.value.push({ label: String(route.matched[0].meta.breadcrumb || ""), to: route.path });
  }

});

</script>
