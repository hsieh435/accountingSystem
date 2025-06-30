<script setup lang="ts">
import { ref } from "vue";
import type { BreadcrumbItem } from "@nuxt/ui"

const items = ref<BreadcrumbItem[]>([
  {
    label: "Home",
    icon: "i-lucide-house"
  },
  {
    label: "Components",
    icon: "i-lucide-box",
    to: "/components"
  },
  {
    label: "Breadcrumb",
    icon: "i-lucide-link",
    to: "/components/breadcrumb"
  }
])
</script>

<template>
  <UBreadcrumb class="bg-stone-200 px-5 py-2" :items="items" />
</template>
