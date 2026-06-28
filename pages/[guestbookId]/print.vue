<template>
  <LoadingIndicator v-if="!guestbook" />
  <template v-else>
    <div class="w-full text-center space-y-4 print:h-screen print:flex print:flex-col print:items-center print:justify-center print:not-last:break-after-page print:break-inside-avoid">
      <h1 class="text-5xl font-bold text-highlighted">
        {{ guestbook.title }}
      </h1>
      <p v-if="guestbook.description" class="text-xl text-muted">
        {{ guestbook.description }}
      </p>
    </div>
    <div
      v-for="page in guestbook.pages"
      :key="page.createdAt"
      class="w-full print:h-screen print:flex print:flex-col print:items-center print:justify-center print:not-last:break-after-page print:break-inside-avoid"
    >
      <UCard class="w-full print:max-w-2xl">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              Von
              <UBadge color="primary" class="text-xl">
                {{ page.author || "Anonymous" }}
              </UBadge>
            </div>
            <div>{{ formatTimestamp(page.createdAt) }}</div>
          </div>
        </template>
        <div class="space-y-4 text-center">
          <div>{{ page.content }}</div>
          <img :src="page.image" class="mx-auto">
        </div>
      </UCard>
    </div>
  </template>
</template>

<script setup lang="ts">
const { guestbook } = useGuestbook();

let hasAutoPrinted = false;

watch(guestbook, async (value) => {
  if (value && !hasAutoPrinted) {
    hasAutoPrinted = true;
    await nextTick();
    window.print();
  }
}, { immediate: true });
</script>
