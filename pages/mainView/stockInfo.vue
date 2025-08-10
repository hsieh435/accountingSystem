<template>
  <div></div>
</template>
<script setup lang="ts">



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "股市查詢",
})



// const posts = await $fetch("https://randomuser.me/api/?results=5", {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// console.log("posts:", posts);



</script>
<style lang="scss" scoped></style>
