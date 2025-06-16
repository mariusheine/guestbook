<template>
  <div class="max-h-screen">
    <UHorizontalNavigation
      :links="links"
      class="border-b border-gray-200 dark:border-gray-800"
    />
    <div class="flex flex-col gap-4 items-center p-8">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HorizontalNavigationLink } from "#ui/types";

const links: HorizontalNavigationLink[] = [
  {
    label: "Party Gästebuch",
    to: "/",
  },
  {
    label: "Neuer Gästebucheintrag",
    to: "/page/new",
  },
];
</script>

<style>
body {
  font-family: 'Kalam', cursive;
}
</style>
