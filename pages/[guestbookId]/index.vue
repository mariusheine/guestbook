<template>
  <LoadingIndicator v-if="!guestbook" />
  <template v-else>
    <div class="w-full flex justify-between items-center">
      <h1>{{ guestbook.title }}</h1>
      <UButton icon="i-heroicons-printer" label="Als PDF exportieren" :to="`/${guestbook.id}/print`" />
    </div>
    <div v-if="pages.length > 0" class="w-full max-h-full flex flex-nowrap gap-4 items-center">
      <UButton icon="i-heroicons-chevron-left" :disabled="pageNumber <= 1" class="h-14 w-14 flex items-center justify-center disabled:bg-gray-500" @click="pageNumber = pageNumber - 1" />
      <GuestbookEntry :page="page" class="flex-grow" />
      <UButton icon="i-heroicons-chevron-right" :disabled="pageNumber >= pages.length" class="h-14 w-14 flex items-center justify-center disabled:bg-gray-500" @click="pageNumber = pageNumber + 1" />
    </div>
    <div v-else>
      <UCard>
        <div class="flex flex-col gap-2 items-center">
          <div>Es gibt noch keinen Gästebucheintrag.</div>

          <div>Sei der/die Erste und erstelle eine Eintrag.</div>

          <UButton :to="`/${guestbook.id}/page/new`">
            Neuer Gästebucheintrag
          </UButton>
        </div>
      </UCard>
    </div>
  </template>
</template>

<script setup lang="ts">
const { guestbook } = useGuestbook();

const pages = computed(() => [...(guestbook.value?.pages || [])].reverse());

const pageNumber = ref(1);
const page = computed(() => {
  if (pages.value.length === 0) {
    return undefined;
  }
  const pageNumberInRange = Math.min(Math.max(1, pageNumber.value), pages.value.length);
  return pages.value[pageNumberInRange - 1];
});
</script>
