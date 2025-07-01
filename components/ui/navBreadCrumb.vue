<template>
  <div>
    <UBreadcrumb class="bg-stone-200 px-5 py-2" :items="items" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { BreadcrumbItem } from "@nuxt/ui"

const items = ref<BreadcrumbItem[]>([
  {
    label: "Home",
    // icon: "i-lucide-house",
    to: "/mainView"
  },
  {
    label: "Components",
    // icon: "i-lucide-box",
    to: `/mainView`
  },
])
</script>