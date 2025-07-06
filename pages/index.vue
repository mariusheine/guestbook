<template>
  <LoadingIndicator v-if="guestbooks === undefined" />
  <div v-else-if="guestbooks.length > 0" class="w-full max-h-full flex gap-4 items-center">
    <UCard v-for="guestbook in guestbooks" class="flex-grow">
      <template #header>
        <div class="flex justify-between items-center">
          Gästebuch: {{ guestbook.title }}
        </div>
      </template>
      <div v-if="guestbook.description">
        {{ guestbook.description }}
      </div>
      <template #footer>
        <UButton :to="`/${guestbook.id}`">
          Öffnen
        </UButton>
      </template>
    </UCard>
  </div>
  <div v-else>
    <UCard>
      <div class="flex flex-col gap-2 items-center">
        <div>Es gibt noch keine Gästebücher.</div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Guestbook } from '~/utils/guestbook';

const { getAvailableGuestbooks } = useGuestbook();

const guestbooks = ref<Guestbook[]>();

onMounted(async () => {
  guestbooks.value = await getAvailableGuestbooks();
})
</script>
