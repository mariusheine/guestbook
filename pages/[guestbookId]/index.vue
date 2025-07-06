<template>
  <LoadingIndicator v-if="!guestbook" />
  <template v-else>
    <h1>{{  guestbook.title }}</h1>
    <div v-if="pages.length > 0" class="w-full max-h-full flex flex-nowrap gap-4 items-center">
      <UButton icon="i-heroicons-chevron-left" :disabled="pageNumber <= 1" class="h-14 w-14 flex items-center justify-center disabled:bg-gray-500" @click="pageNumber = pageNumber - 1"></UButton>
      <UCard class="flex-grow">
          <template #header>
            <template v-if="page">
              <div class="flex justify-between items-center">
                <div>
                  Von
                  <UBadge color="primary" class="text-xl">{{
                    page.author || "Anonymous"
                  }}</UBadge>
                </div>
                <div>{{ formatTimestamp(page.createdAt) }}</div>
              </div>
            </template>
            <template v-else>
              <div class="flex justify-between items-center">
                <USkeleton class="w-[40%] h-9" />
                <USkeleton class="w-[20%] h-9" />
              </div>
            </template>
          </template>
          <template v-if="page">
            <div class="space-y-4 text-center">
              <div>{{ page.content }}</div>
              <img :src="page.image" class="mx-auto" />
              <details>
                <summary>Zusätzlicher Kontext für Bildgenerierung</summary>
                <div>{{  page.imageContext }}</div>
              </details>
            </div>
          </template>
          <USkeleton v-else class="w-full h-[200px]"/>
      </UCard>
      <UButton icon="i-heroicons-chevron-right" :disabled="pageNumber >= pages.length" class="h-14 w-14 flex items-center justify-center disabled:bg-gray-500" @click="pageNumber = pageNumber + 1"></UButton>
    </div>
    <div v-else>
      <UCard>
        <div class="flex flex-col gap-2 items-center">
          <div>Es gibt noch keinen Gästebucheintrag.</div>

          <div>Sei der/die Erste und erstelle eine Eintrag.</div>

          <UButton :to="`/${guestbook.id}/page/new`">Neuer Gästebucheintrag</UButton>
        </div>
      </UCard>
    </div>
  </template>
</template>

<script setup lang="ts">
const { guestbook } = useGuestbook();

const pages = computed(() => guestbook.value?.pages || [])

const pageNumber = ref(1);
const page = computed(() => {
  if (pages.value.length === 0) {
    return undefined;
  }
  const pageNumberInRange = Math.min(Math.max(1, pageNumber.value), pages.value.length);
  return pages.value[pageNumberInRange - 1];
});
</script>
