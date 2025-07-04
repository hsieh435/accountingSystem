<template>
  <div>
    <UNavigationMenu class="w-full justify-start bg-sky-200" :unmount-on-hide="false" :items="items" trailing-icon="i-lucide-arrow-down" content-orientation="vertical" />
  </div>
  <!-- Nuxt的 <NuxtLink to="/path”></NuxtLink>標籤，概念相當於Vue的 <RouterLink to=”/path”></RouterLink>。 -->
  <!-- Nuxt的 <NuxtLayout><NuxtPage></NuxtPage></NuxtLayout>標籤，概念相當於Vue的 <RouterView></RouterView>。 -->
</template>
<script setup lang="ts">
import { ref } from "vue";
// import { useRoute, useRouter } from "vue-router";
import { NavigationMenuItem } from "@nuxt/ui";



// const router = useRouter();
// console.log("getRoutes:", router.getRoutes());



const items = ref<NavigationMenuItem[]>([
  {
    label: "Guide",
    icon: "i-lucide-file-text",
    // to: "/getting-started",
    children: [
      {
        label: "Introduction",
        icon: "i-lucide-file-text",
        to: "mainView/userSetting",
      },
      {
        label: "Installation",
        icon: "i-lucide-file-text"
      },
      {
        label: "Icons",
        icon: "i-lucide-file-text",
      },
      {
        label: "Colors",
        icon: "i-lucide-file-text",
      },
      {
        label: "Theme",
        icon: "i-lucide-file-text",
      }
    ]
  },
  {
    label: "Composables",
    icon: "i-lucide-file-text",
    // to: "/composables",
    children: [
      {
        label: "defineShortcuts",
        icon: "i-lucide-file-text",
        // to: "/composables/define-shortcuts"
      },
      {
        label: "useOverlay",
        icon: "i-lucide-file-text",
        // to: "/composables/use-overlay"
      },
      {
        label: "useToast",
        icon: "i-lucide-file-text",
        // to: "/composables/use-toast"
      }
    ]
  },
  {
    label: "Components",
    icon: "i-lucide-file-text",
    // active: true,
    children: [
      {
        label: "Link",
        icon: "i-lucide-file-text",
        // to: "/components/link"
      },
      {
        label: "Modal",
        icon: "i-lucide-file-text",
        // to: "/components/modal"
      },
      {
        label: "NavigationMenu",
        icon: "i-lucide-file-text",
        // to: "/components/navigation-menu"
      },
      {
        label: "Pagination",
        icon: "i-lucide-file-text",
        // to: "/components/pagination"
      },
      {
        label: "Popover",
        icon: "i-lucide-file-text",
        // to: "/components/popover"
      },
      {
        label: "Progress",
        icon: "i-lucide-file-text",
        // to: "/components/progress"
      }
    ]
  }
])
</script>