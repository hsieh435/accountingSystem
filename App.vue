<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
    <spinner v-if="isLoading" />
  </UApp>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { isLoading } from "@/components/ui/spinnerState.ts";



const spinner = defineAsyncComponent(() => import("@/components/ui/spinner.vue"));



</script>
<style lang="scss" scoped></style>
