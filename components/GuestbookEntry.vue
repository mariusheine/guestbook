<template>
  <UCard
    class="print:flex print:flex-col print:max-h-screen"
    :ui="{ body: fitHeight
      ? 'md:flex-1 md:min-h-0 md:flex md:flex-col md:overflow-y-auto print:flex-1 print:min-h-0 print:flex print:flex-col print:overflow-hidden'
      : 'print:flex-1 print:min-h-0 print:flex print:flex-col print:overflow-hidden',
    }"
  >
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
    <div v-if="page" class="space-y-4 text-center print:flex print:flex-col print:flex-1 print:min-h-0" :class="fitHeight ? 'md:flex md:flex-col md:flex-1 md:min-h-0' : ''">
      <div class="whitespace-pre-line print:shrink-0">
        {{ page.content }}
      </div>
      <img :src="page.image" class="mx-auto max-w-full print:flex-1 print:min-h-0 print:object-contain" :class="fitHeight ? 'md:flex-1 md:min-h-0 object-contain' : ''">
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
    fitHeight?: boolean;
  }>(),
  {
    hideImageContext: false,
    fitHeight: false,
  },
);
</script>
