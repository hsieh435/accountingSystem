<template>
  <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <p class="text-base font-semibold text-indigo-600">404</p>
      <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Page Not Found</h1>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <NuxtLink to="/mainView">
          <UButton class="cursor-pointer my-5" label="返回首頁" icon="i-lucide-rotate-cw" size="xl" />
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
declare function definePageMeta(meta: { [key: string]: string }): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "404 Not Found",
  subTitle: "",
});
</script>
<style lang="scss" scoped></style>
