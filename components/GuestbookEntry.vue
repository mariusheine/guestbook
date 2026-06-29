<template>
  <UCard>
    <template #header>
      <div v-if="page" class="flex justify-between items-center">
        <div>
          Von
          <UBadge color="primary" class="text-xl">
            {{ page.author || "Anonymous" }}
          </UBadge>
        </div>
        <div>{{ formatTimestamp(page.createdAt) }}</div>
      </div>
      <div v-else class="flex justify-between items-center">
        <USkeleton class="w-[40%] h-9" />
        <USkeleton class="w-[20%] h-9" />
      </div>
    </template>
    <div v-if="page" class="space-y-4 text-center">
      <div class="whitespace-pre-line">
        {{ page.content }}
      </div>
      <img :src="page.image" class="mx-auto">
      <details v-if="!hideImageContext">
        <summary>Zusätzlicher Kontext für Bildgenerierung</summary>
        <div>{{ page.imageContext }}</div>
      </details>
    </div>
    <USkeleton v-else class="w-full h-[200px]" />
  </UCard>
</template>

<script setup lang="ts">
import type { Page } from '~/utils/guestbook';

withDefaults(
  defineProps<{
    page?: Page;
    hideImageContext?: boolean;
  }>(),
  {
    hideImageContext: false,
  },
);
</script>
