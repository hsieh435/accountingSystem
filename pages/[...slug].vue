<template>
  <div>
    <h1>404 - Page Not Found</h1>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router"
import { createError } from "h3"



// Handle unknown routes including DevTools requests
const route = useRoute();
// Silently handle DevTools requests
if (route.path.includes(".well-known")) {
  
  throw createError({
    statusCode: 404,
    statusMessage: "Not Found",
    fatal: false
  })
}



</script>
<style lang="scss" scoped></style>
