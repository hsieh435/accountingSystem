<template>
  <div class="w-full">
    <navBarMenu></navBarMenu>
    <navBreadCrumb></navBreadCrumb>
    <!-- <span>1234567890</span> -->
    <slot />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";



const navBarMenu = defineAsyncComponent(() => import("@/components/ui/navBarMenu.vue"));
const navBreadCrumb = defineAsyncComponent(() => import("@/components/ui/navBreadCrumb.vue"));



</script>
<style lang="scss" scoped></style>
