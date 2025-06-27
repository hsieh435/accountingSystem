<template>
  <nav class="w-full p-1 bg-gray-100 text-dark-900" aria-label="breadcrumb">
    <ol class="flex h-8 space-x-2">
      <li class="flex items-center">
        <a class="hover:underline" rel="noopener noreferrer" href="#" title="Back to homepage">
          <svg class="w-5 h-5 pr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
        </a>
      </li>
      <li class="flex items-center space-x-2">
        <svg class="w-2 h-2 mt-1 transform rotate-90 fill-current text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
          <path d="M32 30.031h-32l16-28.061z"></path>
        </svg>
        <a class="flex items-center px-1 capitalize hover:underline" rel="noopener noreferrer" href="#">Parent</a>
      </li>
      <li class="flex items-center space-x-2">
        <svg class="w-2 h-2 mt-1 transform rotate-90 fill-current text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
          <path d="M32 30.031h-32l16-28.061z"></path>
        </svg>
        <a class="flex items-center px-1 capitalize hover:underline hover:no-underline cursor-default" rel="noopener noreferrer" href="#">Current</a>
      </li>
    </ol>
  </nav>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";



</script>
<style lang="scss" scoped></style>
<!-- https://mambaui.com/components/breadcrumb -->

