<template>
  <div class="w-full flex justify-center items-center">
    <div class="container flex flex-col items-center justify-center px-5 mx-auto my-20">
      <div class="max-w-md text-center">
        <h2 class="mb-8 font-extrabold text-9xl dark:text-gray-400">404</h2>
        <p class="text-2xl font-semibold md:text-3xl">頁面不存在</p>
        <NuxtLink to="/mainView">
          <UButton class="cursor-pointer my-5" label="返回首頁" size="xl" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "404 Not Found",
  subTitle: "",
});



</script>
<style lang="scss" scoped></style>
