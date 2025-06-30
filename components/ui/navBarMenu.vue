<script setup lang="ts">
import { ref } from "vue";
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[]>([
  {
    label: "Guide",
    icon: "i-lucide-book-open",
    to: "/getting-started",
    children: [
      {
        label: "Introduction",
        icon: "i-lucide-house"
      },
      {
        label: "Installation",
        icon: "i-lucide-cloud-download"
      },
      {
        label: "Icons",
        icon: "i-lucide-smile",
      },
      {
        label: "Colors",
        icon: "i-lucide-swatch-book",
      },
      {
        label: "Theme",
        icon: "i-lucide-cog",
      }
    ]
  },
  {
    label: "Composables",
    icon: "i-lucide-database",
    to: "/composables",
    children: [
      {
        label: "defineShortcuts",
        icon: "i-lucide-file-text",
        to: "/composables/define-shortcuts"
      },
      {
        label: "useOverlay",
        icon: "i-lucide-file-text",
        to: "/composables/use-overlay"
      },
      {
        label: "useToast",
        icon: "i-lucide-file-text",
        to: "/composables/use-toast"
      }
    ]
  },
  {
    label: "Components",
    icon: "i-lucide-box",
    to: "/components",
    // active: true,
    children: [
      {
        label: "Link",
        icon: "i-lucide-file-text",
        to: "/components/link"
      },
      {
        label: "Modal",
        icon: "i-lucide-file-text",
        to: "/components/modal"
      },
      {
        label: "NavigationMenu",
        icon: "i-lucide-file-text",
        to: "/components/navigation-menu"
      },
      {
        label: "Pagination",
        icon: "i-lucide-file-text",
        to: "/components/pagination"
      },
      {
        label: "Popover",
        icon: "i-lucide-file-text",
        to: "/components/popover"
      },
      {
        label: "Progress",
        icon: "i-lucide-file-text",
        to: "/components/progress"
      }
    ]
  }
])
</script>
<template>
  <UNavigationMenu class="w-full justify-start bg-sky-200" :unmount-on-hide="false" :items="items" trailing-icon="i-lucide-arrow-down" content-orientation="vertical" />
</template>
