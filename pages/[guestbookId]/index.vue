<template>
  <LoadingIndicator v-if="!guestbook" />
  <template v-else>
    <div
      v-show="isPrintingImage"
      class="fixed inset-0 z-50 bg-white flex items-center justify-center"
    >
      <img v-if="page" :src="page.image" class="max-w-full max-h-full object-contain">
    </div>

    <div v-show="!isPrintingImage" class="w-full flex flex-col gap-4 items-center md:flex-1 md:min-h-0">
      <div v-if="pages.length > 0" class="w-full flex flex-col gap-4 items-center md:flex-1 md:min-h-0">
        <div class="w-full flex flex-nowrap gap-4 items-center md:flex-1 md:min-h-0">
          <UButton icon="i-heroicons-chevron-left" :disabled="pageNumber <= 1" class="h-14 w-14 flex items-center justify-center disabled:bg-gray-500" @click="pageNumber = pageNumber - 1" />
          <GuestbookEntry :page="page" fit-height class="grow md:self-stretch md:flex md:flex-col md:min-h-0" />
          <UButton icon="i-heroicons-chevron-right" :disabled="pageNumber >= pages.length" class="h-14 w-14 flex items-center justify-center disabled:bg-gray-500" @click="pageNumber = pageNumber + 1" />
        </div>
        <UButton v-if="page" icon="i-heroicons-printer" @click="printImage">
          Bild drucken
        </UButton>
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

const isPrintingImage = ref(false);

async function printImage() {
  isPrintingImage.value = true;
  await nextTick();
  window.addEventListener('afterprint', () => {
    isPrintingImage.value = false;
  }, { once: true });
  window.print();
}
</script>
